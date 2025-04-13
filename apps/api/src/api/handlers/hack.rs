use std::sync::Arc;

use axum::{extract::State, http::HeaderMap};
use jsonwebtoken::{DecodingKey, Validation, decode};

use crate::{api::state::AppState, error::AppError, services::generator_service::Claims};

fn response_ascii(num: i32) -> String {
    format!(
        r#"
xgknocptuaulsnlrpukczqvtughbddyoqkhpmdazxebekdpiowimlpjirkhkzmapbfaprapkcfbvkvqu
gwywenmhncwpzexvpjfegdvizjccchcndyoqemykdecdpsqswqwvddmehshnueecyfmmiywtyloxgzry
krocobfoltxivmwobdbzmectuncylcwlxmmjykgnvghlncelpzcpvfgmvpjwnoqmglxvfbfrxcujtpzq
pkecx                                                                      pgjcn
xklzk                                                                      oulef
xfgby                                                                      kzdgj
vnqos                                                                      zxfmg
edwaq                                                                      lfrto
dcntd                                                                      lxhjb
barsu                              {}                                      ujnjt
kixdo                                                                      wlwqn
rsfnr                                                                      kqvvs
hxqhi                                                                      ylqeg
nchtf                                                                      yvpru
twhar                                                                      fpnwe
mzeir                                                                      pcvhx
wnfxsoxyjdwhxfmceatounsoicmpeuiigktwsozamdgcxqkouppocaqobrjgvhyoqqjibiwxwwfpblyw
eblfblvytgbyefmqixldsjzyuohhoixqexfskcxmwhynpxintxdnwrqxbwfuhdwwlpvzexkzcubsxeub
infteiwbewqablgonhuqsnkgnfkwlmczyjppxilkjgcceflqergwhoxezytdhvfinqllvzsfvfdgimai"#,
        num
    )
}

pub async fn hack(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
) -> Result<String, AppError> {
    let auth_header = headers
        .get("authorization")
        .ok_or_else(|| AppError::BadRequest("No Authorization header provided".to_string()))?
        .to_str()
        .map_err(|_| AppError::BadRequest("Invalid Authorization header".to_string()))?;

    if !auth_header.starts_with("Bearer ") {
        return Err(AppError::BadRequest("Wrong format on header".to_string()));
    }

    let token = auth_header.trim_start_matches("Bearer ").trim();

    let decoded_header = decode::<Claims>(
        token,
        &DecodingKey::from_secret(&[]),
        &Validation::default(),
    )
    .map_err(|_| AppError::BadRequest("Missing or wrong payload".to_string()))?;

    let jwt_key = state
        .generator_service
        .generate_jwt_key(decoded_header.claims.payload)
        .to_string();

    decode::<Claims>(
        token,
        &DecodingKey::from_secret(jwt_key.as_bytes()),
        &Validation::default(),
    )
    .map_err(|_| AppError::BadRequest(format!("{} attempts left", rand::random::<u8>())))?;

    let solution = state
        .generator_service
        .generate_solution_value(decoded_header.claims.payload);

    Ok(response_ascii(solution))
}

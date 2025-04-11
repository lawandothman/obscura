-- Add migration script here

CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  start_time BIGINT NOT NULL,
  end_time BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE OR REPLACE FUNCTION get_submission_score(start_time BIGINT, end_time BIGINT) 
RETURNS BIGINT AS $$
BEGIN
RETURN CASE
WHEN end_time IS NULL THEN NULL
ELSE end_time - start_time
  END;
END;
$$ LANGUAGE plpgsql;

CREATE VIEW leaderboard AS
SELECT id, name, start_time, end_time, get_submission_score(start_time, end_time) AS score
FROM submissions
WHERE end_time IS NOT NULL
ORDER BY 
get_submission_score(start_time, end_time) ASC;


SELECT id, payload, jsonb_typeof(payload) AS type
FROM advocates
WHERE jsonb_typeof(payload) != 'array' OR payload IS NULL;
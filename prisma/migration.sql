ALTER TABLE action ADD CONSTRAINT action_exactly_one_owner CHECK (
  num_nonnulls (project_id, service_id, product_id) = 1
);

CREATE INDEX idx_action_project_id ON action (project_id)
WHERE
  project_id IS NOT NULL;

CREATE INDEX idx_action_service_id ON action (service_id)
WHERE
  service_id IS NOT NULL;

CREATE INDEX idx_action_product_id ON action (product_id)
WHERE
  product_id IS NOT NULL;
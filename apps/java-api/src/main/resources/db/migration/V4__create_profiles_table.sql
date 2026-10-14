CREATE TABLE profiles
(
    user_id UUID PRIMARY KEY,
    display_name VARCHAR(80) NOT NULL,
    fpl_manager_id BIGINT,
    CONSTRAINT profiles_display_name_not_blank
        CHECK (length(trim(display_name)) > 0),
    CONSTRAINT profiles_fpl_manager_id_positive
        CHECK (fpl_manager_id IS NULL OR fpl_manager_id > 0)
);
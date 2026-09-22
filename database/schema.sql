CREATE TABLE facilities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL,
    address TEXT,
    erp_capacity INT NOT NULL CHECK (erp_capacity > 0),
    is_divisible BOOLEAN NOT NULL DEFAULT FALSE,
    created_ar TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE associations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(30),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE families (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    family_quotient NUMERIC(10,2) CHECK (family_quotient >= 0),
    is_resident BOOLEAN NOT NULL DEFAULT FALSE,
    address TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE members (
    id BIGSERIAL PRIMARY KEY,
    family_id BIGINT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(30),
    medical_certificate_date DATE,
    medical_status VARCHAR(30) NOT NULL DEFAULT 'pending',
    pass_sport_code VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_members_family
        FOREIGN KEY (family_id)
        REFERENCES families(id),

    CONSTRAINT chk_medical_status
        CHECK (
            medical_status IN (
                'pending',
                'compliant',
                'medical_non_compliant'
            )
        )
);

CREATE TABLE activities (
    id BIGSERIAL PRIMARY KEY,
    association_id BIGINT NOT NULL,
    facility_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    season VARCHAR(20) NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    sub_zone VARCHAR(100),
    max_capacity INT NOT NULL,
    base_price NUMERIC(10,2) NOT NULL,
    age_category VARCHAR(50),
    is_all_public BOOLEAN NOT NULL DEFAULT FALSE,
    is_risk_sport BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_activities_association
        FOREIGN KEY (association_id)
        REFERENCES associations(id),

    CONSTRAINT fk_activities_facility
        FOREIGN KEY (facility_id)
        REFERENCES facilities(id),

    CONSTRAINT chk_activity_capacity
        CHECK (max_capacity > 0),

    CONSTRAINT chk_activity_price
        CHECK (base_price >= 0),

    CONSTRAINT chk_activity_time
        CHECK (start_time < end_time),

    CONSTRAINT chk_activity_status
        CHECK (
            status IN (
                'active',
                'full',
                'cancelled'
            )
        )
);

CREATE TABLE registrations (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT NOT NULL,
    activity_id BIGINT NOT NULL,
    final_price NUMERIC(10,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'confirmed',
    payment_plan INT NOT NULL DEFAULT 1,
    registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP,

    CONSTRAINT fk_registrations_member
        FOREIGN KEY (member_id)
        REFERENCES members(id),

    CONSTRAINT fk_registrations_activity
        FOREIGN KEY (activity_id)
        REFERENCES activities(id),

    CONSTRAINT uq_member_activity
        UNIQUE (member_id, activity_id),

    CONSTRAINT chk_registration_price
        CHECK (final_price >= 15),

    CONSTRAINT chk_registration_status
        CHECK (
            status IN (
                'confirmed',
                'cancelled',
                'medical_non_compliant'
            )
        ),

    CONSTRAINT chk_payment_plan
        CHECK (payment_plan IN (1, 3))
);
CREATE TABLE waiting_list (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    priority_score INT NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'waiting',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    promoted_at TIMESTAMP,
    deadline_confirmation TIMESTAMP,

    CONSTRAINT fk_waiting_activity
        FOREIGN KEY (activity_id)
        REFERENCES activities(id),

    CONSTRAINT fk_waiting_member
        FOREIGN KEY (member_id)
        REFERENCES members(id),

    CONSTRAINT uq_waiting_member_activity
        UNIQUE (member_id, activity_id),

    CONSTRAINT chk_waiting_status
        CHECK (
            status IN (
                'waiting',
                'promoted_pending',
                'confirmed',
                'expired',
                'cancelled'
            )
        )
);

CREATE INDEX idx_members_family
ON members(family_id);

CREATE INDEX idx_activities_association
ON activities(association_id);

CREATE INDEX idx_activities_facility
ON activities(facility_id);

CREATE INDEX idx_registrations_member
ON registrations(member_id);

CREATE INDEX idx_registrations_activity
ON registrations(activity_id);

CREATE INDEX idx_waiting_list_activity_priority
ON waiting_list(activity_id, priority_score DESC, created_at ASC);

ALTER TABLE facilities
RENAME COLUMN created_ar TO created_at;
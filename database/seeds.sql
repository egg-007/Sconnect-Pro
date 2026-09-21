INSERT INTO facilities (
    name,
    type,
    address,
    erp_capacity,
    is_divisible
)
VALUES (
    'Municipal Gym',
    'gymnasium',
    'City Center',
    100,
    TRUE
);

INSERT INTO associations (
    name,
    email,
    phone
)
VALUES (
    'Basket Club',
    'contact@basketclub.test',
    '0600000000'
);

INSERT INTO families (
    name,
    family_quotient,
    is_resident,
    address
)
VALUES (
    'Smith Family',
    550,
    TRUE,
    'City Center'
);
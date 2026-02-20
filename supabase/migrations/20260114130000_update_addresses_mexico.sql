-- Add Mexican address fields and rename address_line1 to street
alter table addresses 
  rename column address_line1 to street;

alter table addresses 
  add column exterior_number text,
  add column interior_number text,
  add column neighborhood text,
  add column delivery_instructions text;

-- Drop address_line2 as it's replaced by more specific fields
alter table addresses 
  drop column address_line2;

SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict Ivfv3nDwIG39n6avdzbKf0V2tStavcwa3QyAOewdWJm3HSywB5nWxS884MOGeDG

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '3277d786-f87c-49d9-90cb-1f890d4ca164', '{"action":"user_confirmation_requested","actor_id":"87b9edee-2a64-4b0d-825a-84a7fb13ffe5","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-10-26 01:37:04.626964+00', ''),
	('00000000-0000-0000-0000-000000000000', '36ba84d1-415b-48e0-bf94-2075f6893001', '{"action":"user_confirmation_requested","actor_id":"7f4851e7-95c0-47d5-86b1-dfbe75cd00a6","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-10-26 03:13:23.776502+00', ''),
	('00000000-0000-0000-0000-000000000000', '9a3065b5-3af6-4da3-b790-7c63749e6393', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"misrrafan777@gmail.com","user_id":"7f4851e7-95c0-47d5-86b1-dfbe75cd00a6","user_phone":""}}', '2025-10-26 03:16:23.227315+00', ''),
	('00000000-0000-0000-0000-000000000000', '57c86888-7c0a-4489-9b68-a5cda90374be', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"jramirezlopez03@gmail.com","user_id":"87b9edee-2a64-4b0d-825a-84a7fb13ffe5","user_phone":""}}', '2025-10-26 03:16:23.227789+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ab676701-af54-4acd-bf3c-0b20b541a900', '{"action":"user_signedup","actor_id":"bece9292-9f5a-4b50-a8b0-36a55ceca9f2","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-10-26 03:17:42.382793+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f260df0a-8b7e-4e29-979d-4e10a3d47078', '{"action":"login","actor_id":"bece9292-9f5a-4b50-a8b0-36a55ceca9f2","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-26 03:17:42.38809+00', ''),
	('00000000-0000-0000-0000-000000000000', '9b94b865-5cad-4023-a85c-b6f673750d05', '{"action":"user_signedup","actor_id":"755aa8eb-28c2-49a5-9140-d3399d223f4f","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-10-26 03:22:37.791792+00', ''),
	('00000000-0000-0000-0000-000000000000', '6a6e1419-4935-4818-ab12-34aa3af8ff07', '{"action":"login","actor_id":"755aa8eb-28c2-49a5-9140-d3399d223f4f","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-26 03:22:37.800784+00', ''),
	('00000000-0000-0000-0000-000000000000', '3d7f43a9-fd1f-4635-8f4f-c51f1b6aa318', '{"action":"login","actor_id":"755aa8eb-28c2-49a5-9140-d3399d223f4f","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-26 03:22:49.88678+00', ''),
	('00000000-0000-0000-0000-000000000000', '90ce9b02-d133-4ad2-880e-8502bfada8f1', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"misrrafan777@gmail.com","user_id":"755aa8eb-28c2-49a5-9140-d3399d223f4f","user_phone":""}}', '2025-10-26 03:25:03.779493+00', ''),
	('00000000-0000-0000-0000-000000000000', '32c38f6a-aa38-4db4-906b-724c9df6f03c', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"jramirezlopez03@gmail.com","user_id":"bece9292-9f5a-4b50-a8b0-36a55ceca9f2","user_phone":""}}', '2025-10-26 03:25:03.78011+00', ''),
	('00000000-0000-0000-0000-000000000000', '19ee9fc6-3a15-4e83-a674-7db50c5e540c', '{"action":"user_signedup","actor_id":"76a33feb-7336-400d-ad98-be436b154d1f","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-10-26 03:59:17.362641+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cc46b9c1-7713-4645-8861-6161a594a7a0', '{"action":"login","actor_id":"76a33feb-7336-400d-ad98-be436b154d1f","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-26 03:59:17.37819+00', ''),
	('00000000-0000-0000-0000-000000000000', '0eddf676-8074-45f5-a26d-3b9ac57eba2b', '{"action":"login","actor_id":"76a33feb-7336-400d-ad98-be436b154d1f","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-26 04:04:06.094761+00', ''),
	('00000000-0000-0000-0000-000000000000', '59d000b2-2740-487d-b5fa-e11581e97ddb', '{"action":"login","actor_id":"76a33feb-7336-400d-ad98-be436b154d1f","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-26 04:04:37.094029+00', ''),
	('00000000-0000-0000-0000-000000000000', '40530d1e-d41b-4466-978e-b13bb2036aa3', '{"action":"user_signedup","actor_id":"feb75d00-0284-4d27-9ee2-ce24853764ef","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-10-26 04:20:46.775437+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd1c12468-56c0-449e-8d54-61f0e5d79b33', '{"action":"login","actor_id":"feb75d00-0284-4d27-9ee2-ce24853764ef","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-26 04:20:46.793318+00', ''),
	('00000000-0000-0000-0000-000000000000', '9a65c88c-c776-4ae8-81a2-af0d8d080790', '{"action":"login","actor_id":"76a33feb-7336-400d-ad98-be436b154d1f","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-26 04:33:56.557078+00', ''),
	('00000000-0000-0000-0000-000000000000', '98eea768-3b69-4946-bb43-9c40d317a9f6', '{"action":"login","actor_id":"76a33feb-7336-400d-ad98-be436b154d1f","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-26 04:41:01.400483+00', ''),
	('00000000-0000-0000-0000-000000000000', '8c15ce47-e19f-4c02-a223-1d4b8e949b1e', '{"action":"user_repeated_signup","actor_id":"76a33feb-7336-400d-ad98-be436b154d1f","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-10-29 01:35:01.160383+00', ''),
	('00000000-0000-0000-0000-000000000000', '3d35d01b-d12a-487e-beb2-c01fea2c8364', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"jramirezlopez03@gmail.com","user_id":"76a33feb-7336-400d-ad98-be436b154d1f","user_phone":""}}', '2025-10-29 01:35:11.529814+00', ''),
	('00000000-0000-0000-0000-000000000000', 'debc99c5-03ce-4d08-adbe-31074f6d5bd9', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"misrrafan777@gmail.com","user_id":"feb75d00-0284-4d27-9ee2-ce24853764ef","user_phone":""}}', '2025-10-29 01:35:11.669594+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aea58f72-6cfb-4726-87c4-52c414aa61ab', '{"action":"user_signedup","actor_id":"35785dd0-3770-498a-ba6a-29cce86f703f","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-10-29 01:35:16.346808+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ce2f86a1-0219-4600-ac56-3dccd25c15d3', '{"action":"login","actor_id":"35785dd0-3770-498a-ba6a-29cce86f703f","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 01:35:16.354296+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a613b8e6-b750-4ae1-81ae-50590e00bd74', '{"action":"user_repeated_signup","actor_id":"35785dd0-3770-498a-ba6a-29cce86f703f","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-10-29 01:39:09.499869+00', ''),
	('00000000-0000-0000-0000-000000000000', '517a55a9-60cf-4930-91a8-aa13ebee380a', '{"action":"user_repeated_signup","actor_id":"35785dd0-3770-498a-ba6a-29cce86f703f","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-10-29 01:39:33.535348+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bfa12d84-c252-47b6-a16d-85ca331d22bb', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"jramirezlopez03@gmail.com","user_id":"35785dd0-3770-498a-ba6a-29cce86f703f","user_phone":""}}', '2025-10-29 01:40:01.018284+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eb933bd6-2919-4e65-8762-4faa9dce4e4b', '{"action":"token_revoked","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-23 05:37:04.98002+00', ''),
	('00000000-0000-0000-0000-000000000000', '84b82a8d-dc9d-407a-a7f1-fc35ee03ae0e', '{"action":"user_signedup","actor_id":"bdac3d07-70ac-45aa-84fa-f135ffc460d9","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-10-29 01:40:05.510445+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a64aee6e-b0b0-483f-b9a6-8b84c9a3171c', '{"action":"login","actor_id":"bdac3d07-70ac-45aa-84fa-f135ffc460d9","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 01:40:05.519142+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd4788116-e74a-4985-966e-18c2ea8cdf30', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"jramirezlopez03@gmail.com","user_id":"bdac3d07-70ac-45aa-84fa-f135ffc460d9","user_phone":""}}', '2025-10-29 01:40:39.6695+00', ''),
	('00000000-0000-0000-0000-000000000000', '13257fc4-36d0-4829-89d3-bff08246e42e', '{"action":"user_signedup","actor_id":"f28e91ad-3d70-455c-a5e8-c88ea7ee0707","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-10-29 01:43:30.272877+00', ''),
	('00000000-0000-0000-0000-000000000000', '915b4f5a-7b75-426d-ad35-fbdfdbd4b2f2', '{"action":"login","actor_id":"f28e91ad-3d70-455c-a5e8-c88ea7ee0707","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 01:43:30.278025+00', ''),
	('00000000-0000-0000-0000-000000000000', '3bb62b3d-d71b-4473-b74f-ae0d350191aa', '{"action":"user_repeated_signup","actor_id":"f28e91ad-3d70-455c-a5e8-c88ea7ee0707","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-10-29 01:43:30.596764+00', ''),
	('00000000-0000-0000-0000-000000000000', '43eec756-307b-40a1-935c-072019853663', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"jramirezlopez03@gmail.com","user_id":"f28e91ad-3d70-455c-a5e8-c88ea7ee0707","user_phone":""}}', '2025-10-29 01:44:35.906854+00', ''),
	('00000000-0000-0000-0000-000000000000', '837e85d4-43ed-4906-b3bd-9504477186cb', '{"action":"user_signedup","actor_id":"43e0703b-6c01-49c9-88a9-157ba7b97d19","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-10-29 01:44:50.944934+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cda9aed4-a6a3-45cc-b5bd-5ee9798f26ae', '{"action":"login","actor_id":"43e0703b-6c01-49c9-88a9-157ba7b97d19","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 01:44:50.952145+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd9fbe871-09d3-4e5a-b9f6-f74238a8bad5', '{"action":"user_repeated_signup","actor_id":"43e0703b-6c01-49c9-88a9-157ba7b97d19","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-10-29 01:45:01.391895+00', ''),
	('00000000-0000-0000-0000-000000000000', '71d6328d-d1cb-4d41-9d64-e1fa42dc26a5', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"jramirezlopez03@gmail.com","user_id":"43e0703b-6c01-49c9-88a9-157ba7b97d19","user_phone":""}}', '2025-10-29 01:45:09.292996+00', ''),
	('00000000-0000-0000-0000-000000000000', '9d9c64ee-48d1-40c5-9d30-b14559358ffe', '{"action":"user_signedup","actor_id":"e1cbd455-b433-4c8d-b39d-04435c0dcbcc","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-10-29 01:45:15.309928+00', ''),
	('00000000-0000-0000-0000-000000000000', '96b476e5-576d-4773-843b-77ddb146ab50', '{"action":"login","actor_id":"e1cbd455-b433-4c8d-b39d-04435c0dcbcc","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 01:45:15.314251+00', ''),
	('00000000-0000-0000-0000-000000000000', '5ac9df1f-11c3-4079-bf2f-90bba7b410f1', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"jramirezlopez03@gmail.com","user_id":"e1cbd455-b433-4c8d-b39d-04435c0dcbcc","user_phone":""}}', '2025-10-29 01:46:53.65306+00', ''),
	('00000000-0000-0000-0000-000000000000', '3a9417ce-424a-4c98-837e-ae20149d9303', '{"action":"user_signedup","actor_id":"5512bbd0-a31e-46fc-b38d-166f5c639d50","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-10-29 01:49:39.250466+00', ''),
	('00000000-0000-0000-0000-000000000000', '7ce78c9a-1f33-4aa7-bff6-1585e519b13a', '{"action":"login","actor_id":"5512bbd0-a31e-46fc-b38d-166f5c639d50","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 01:49:39.255285+00', ''),
	('00000000-0000-0000-0000-000000000000', '624f8586-bfac-4609-9aa2-10560c416dd0', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"jramirezlopez03@gmail.com","user_id":"5512bbd0-a31e-46fc-b38d-166f5c639d50","user_phone":""}}', '2025-10-29 01:52:37.627313+00', ''),
	('00000000-0000-0000-0000-000000000000', '7fb92b01-3867-4aa8-b725-ef67ca468d0a', '{"action":"user_signedup","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-10-29 01:53:01.409345+00', ''),
	('00000000-0000-0000-0000-000000000000', '6bfd8c26-83f6-4002-8e41-79b542e91726', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 01:53:01.412648+00', ''),
	('00000000-0000-0000-0000-000000000000', '4708031a-9681-429d-8913-0142ea7322a6', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 01:53:02.016453+00', ''),
	('00000000-0000-0000-0000-000000000000', '21e97df8-2d38-4e23-ae79-9bd2d43e03c2', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 01:54:40.061035+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b77b7121-dee7-438b-a54f-3a6a38f0b0b3', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:00:24.676873+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e9d12d2e-5ea8-426a-b149-881b879e7e28', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:01:45.726988+00', ''),
	('00000000-0000-0000-0000-000000000000', '679ecf77-722e-45ad-847f-e51afbeed030', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:06:26.997014+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fd004cf6-a596-41ab-b0a9-c50bb25b220f', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:09:11.976618+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ccc748e1-2571-43ed-86ab-66fa2abb3f95', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:22:55.626947+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e04d5bd1-b63a-48fe-8b74-fce63bf03577', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:24:45.268751+00', ''),
	('00000000-0000-0000-0000-000000000000', '884a809b-fd8b-4026-832d-b82ef2ac4310', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:24:54.755261+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd6acb2db-42c7-4ff0-968f-5226eda4e9f9', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:25:32.585069+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e000b7fa-064c-4c53-9991-b9371b37c76c', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:27:36.233792+00', ''),
	('00000000-0000-0000-0000-000000000000', '94305d86-5492-40ec-966f-44bd256bf8ba', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:28:11.895665+00', ''),
	('00000000-0000-0000-0000-000000000000', '3e4420d7-7e0a-4a15-826a-76f95206bfc5', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:32:49.221801+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b788fbad-8edf-4953-9508-2a93a2445822', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:33:07.502514+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ca4bf977-1a10-4c77-9742-f796ec6e63ed', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:33:40.080684+00', ''),
	('00000000-0000-0000-0000-000000000000', 'db2234a8-7ed4-424a-9704-91dfcfa948c2', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:34:13.692952+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e7c4c48b-f126-4150-ad31-6a74d6247ec0', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:35:21.16333+00', ''),
	('00000000-0000-0000-0000-000000000000', '092897af-ae23-4702-85c8-afb306a4d477', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:37:32.196036+00', ''),
	('00000000-0000-0000-0000-000000000000', '7697e0ac-7380-476d-bf8a-06b4fcf41376', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:43:17.942639+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd5ead7cd-ae7b-4e68-ac1d-af7fadcc9e6f', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:45:41.918201+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ecc8702d-3040-4b10-b002-c183b6d46860', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:45:43.261221+00', ''),
	('00000000-0000-0000-0000-000000000000', '18012271-b5ca-4fc0-bbde-fabb275e8d8b', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:45:48.186828+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ae5198c4-56eb-44d9-9697-55da88f271d3', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:45:57.374135+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f38b9079-f7bd-405f-8b6a-7414b9eb0be1', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:45:59.019257+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b2f2b539-9a83-4049-806f-468b8c5c9d62', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:46:09.024498+00', ''),
	('00000000-0000-0000-0000-000000000000', '03872c71-9358-4d40-b114-d66eccb5ad4e', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:46:11.034166+00', ''),
	('00000000-0000-0000-0000-000000000000', '239a23c1-f5d0-42e4-87d6-721da7851e75', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:48:21.971617+00', ''),
	('00000000-0000-0000-0000-000000000000', '8c5334a2-a311-4406-a9d2-2128045e8e14', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-29 02:48:32.661062+00', ''),
	('00000000-0000-0000-0000-000000000000', '1f9f3b11-71d1-4f4d-b57e-99047847ddba', '{"action":"user_signedup","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-11-23 00:35:11.783142+00', ''),
	('00000000-0000-0000-0000-000000000000', '7e3bf3bc-d1e0-483b-9c23-5fbff49df3e8', '{"action":"login","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-23 00:35:11.792164+00', ''),
	('00000000-0000-0000-0000-000000000000', '2c363211-2b4b-4256-a7b8-b315c7280493', '{"action":"login","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-23 00:35:12.734982+00', ''),
	('00000000-0000-0000-0000-000000000000', '593ac074-6703-4bcc-855d-8e6eaf65a93a', '{"action":"token_refreshed","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-23 01:38:12.928979+00', ''),
	('00000000-0000-0000-0000-000000000000', '76ce44e5-bf7c-431a-b4b4-6a0509e4192f', '{"action":"token_revoked","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-23 01:38:12.948847+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bf13861f-a41d-4c70-bed0-888e26ca8689', '{"action":"token_refreshed","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-23 01:38:13.167097+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a735e91e-a697-42d0-a382-877468419ec6', '{"action":"token_refreshed","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-23 02:50:52.856704+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f8c06526-e87e-4bb2-a969-a9c3ef4de1cb', '{"action":"token_revoked","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-23 02:50:52.869299+00', ''),
	('00000000-0000-0000-0000-000000000000', '59ac526e-fd42-4009-b9b9-6373b1b8ed37', '{"action":"login","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-23 03:14:33.076909+00', ''),
	('00000000-0000-0000-0000-000000000000', '196ecd57-c464-4391-b2e2-7f29894f49d6', '{"action":"token_refreshed","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-23 05:36:54.651294+00', ''),
	('00000000-0000-0000-0000-000000000000', '297a54cb-7c89-4bf7-ac86-77e89bfd8526', '{"action":"token_revoked","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-23 05:36:54.673567+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f82b56ce-b9fc-4068-a5dd-5d059f6ad3e8', '{"action":"token_refreshed","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-23 05:37:04.977137+00', ''),
	('00000000-0000-0000-0000-000000000000', '391e95b8-ea0c-453a-9afe-458de0a975e8', '{"action":"token_refreshed","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-23 20:11:47.493997+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e90d2d3f-c3de-4663-bd0f-843f65cfaceb', '{"action":"token_revoked","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-23 20:11:47.513013+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dc55bee9-6120-4a81-ab63-6f4d99a56943', '{"action":"token_refreshed","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-23 20:40:19.018497+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eae11c34-27e6-4042-a68b-1fa740a256d8', '{"action":"token_revoked","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-23 20:40:19.031361+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b1377689-b143-4740-9845-bd97511dc8df', '{"action":"token_refreshed","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-23 21:14:29.570115+00', ''),
	('00000000-0000-0000-0000-000000000000', '04069471-132f-4aba-9de3-9af38bc17dfa', '{"action":"token_revoked","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-23 21:14:29.585067+00', ''),
	('00000000-0000-0000-0000-000000000000', '4d70b04a-df6c-4b8d-b77f-73ef32eaf726', '{"action":"token_refreshed","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-23 21:14:29.654554+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd956532c-120e-4159-85c9-853574d0d1e7', '{"action":"token_refreshed","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-23 22:03:27.925958+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dc4f8929-5bf5-46d2-beca-85f02f923063', '{"action":"token_revoked","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-23 22:03:27.941496+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cf278d7f-96df-4a73-adda-81bb916f442c', '{"action":"token_refreshed","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-24 02:18:26.75735+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd66f0cfd-26d8-4c06-b493-868a39cb4774', '{"action":"token_revoked","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-24 02:18:26.781628+00', ''),
	('00000000-0000-0000-0000-000000000000', '6742b5cd-0ab1-4be9-b77a-bd54f4411a7b', '{"action":"token_refreshed","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-24 18:50:02.971161+00', ''),
	('00000000-0000-0000-0000-000000000000', '2c06028a-0087-4a5e-a40c-f6ee5bdb9ae0', '{"action":"token_revoked","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-24 18:50:02.993797+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd74254a7-2dca-4ad8-a123-1b23b4eccf82', '{"action":"token_refreshed","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-24 19:27:43.907097+00', ''),
	('00000000-0000-0000-0000-000000000000', '99e8345b-ebe6-42db-a957-01b2737b1558', '{"action":"token_revoked","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-24 19:27:43.92308+00', ''),
	('00000000-0000-0000-0000-000000000000', '269ad58a-0c08-48c4-9e64-73f1ba39440c', '{"action":"token_refreshed","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-24 19:28:29.370236+00', ''),
	('00000000-0000-0000-0000-000000000000', '1872e7b1-fb95-4d5d-a11a-a3c7d3ce65e0', '{"action":"logout","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-11-24 19:45:37.854436+00', ''),
	('00000000-0000-0000-0000-000000000000', '5755a68c-c2a6-4dca-868d-1f9f453c3630', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-24 20:18:04.560716+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e7e4b229-056c-472d-8aa6-6bd655c64598', '{"action":"token_refreshed","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-24 23:50:28.405395+00', ''),
	('00000000-0000-0000-0000-000000000000', '2ef5bdaf-d6b1-45e6-923a-eb43c00ee155', '{"action":"token_revoked","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-24 23:50:28.431418+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ebc6bb05-4f5c-49b1-8449-c7cbf7b048d6', '{"action":"token_refreshed","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-25 04:06:23.234521+00', ''),
	('00000000-0000-0000-0000-000000000000', '48dd48b5-1f7e-48b2-b2b1-7e6dcc90543f', '{"action":"token_revoked","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-11-25 04:06:23.260872+00', ''),
	('00000000-0000-0000-0000-000000000000', '8948872b-1617-4495-a887-c27e955fccc6', '{"action":"login","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:10:25.89509+00', ''),
	('00000000-0000-0000-0000-000000000000', '7fad1485-7d0a-460f-b5ba-4f4a91b40cdc', '{"action":"login","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:10:26.933503+00', ''),
	('00000000-0000-0000-0000-000000000000', '27825384-968c-4a1c-91fe-83a53f331676', '{"action":"login","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:10:39.656162+00', ''),
	('00000000-0000-0000-0000-000000000000', '746dd611-1167-4d19-87b0-170cf650f0fc', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:10:57.735468+00', ''),
	('00000000-0000-0000-0000-000000000000', '2ce812bd-61fa-404d-8b90-c69ec9a82709', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:11:07.953161+00', ''),
	('00000000-0000-0000-0000-000000000000', '32dabb89-b6a8-46c7-9496-4fd1b7bb1f59', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:11:13.695937+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b1dac5ff-92a4-49a3-8c3c-434a72ec9cd1', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:11:15.798099+00', ''),
	('00000000-0000-0000-0000-000000000000', '35f8f53a-8ae9-4d1d-a103-7210c6d905d0', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:11:15.971158+00', ''),
	('00000000-0000-0000-0000-000000000000', '967235ca-bfed-4692-893b-f66584e0051a', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:11:16.129335+00', ''),
	('00000000-0000-0000-0000-000000000000', '0d7b82e2-a886-41c5-8896-730e2bf0fb9b', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:12:00.434117+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b27a07c9-24ba-4d42-8c5e-f0ca25a3b6d3', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:12:06.354766+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e1792b08-5ffd-4c23-97d6-9c110ffb3d09', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:12:06.481445+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f45d61df-c9d5-4d44-9689-d59ad41c8899', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:12:06.662151+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f92c7868-1d3b-4514-a12d-e51f261ac229', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:12:06.81882+00', ''),
	('00000000-0000-0000-0000-000000000000', '4aa9e4b1-8d00-4f3c-97c4-04cfd911b63a', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:12:10.98853+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fcc3a6fa-f78d-4512-a766-c29ff4f6c190', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:12:12.72415+00', ''),
	('00000000-0000-0000-0000-000000000000', '0db1c853-62d1-41bb-b81b-ce0fa98b6125', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:12:12.998649+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f5bff85f-d4ab-4205-a753-96d67ecd5266', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:12:13.272494+00', ''),
	('00000000-0000-0000-0000-000000000000', '64590ce3-f77f-49ac-8f56-e3900e8ffc67', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:12:13.704733+00', ''),
	('00000000-0000-0000-0000-000000000000', '1099dfff-5c71-4c75-ade9-9f216a649af0', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:12:13.929329+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ccca0879-a468-4c22-a354-68cfe5f5d124', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:12:14.148092+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f4ef1f13-4996-4f65-9aa7-6e9e2252ef2e', '{"action":"user_signedup","actor_id":"d1bf5bf0-81bf-4e4c-b2c0-78cf68267d02","actor_username":"jramirezeng03@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-11-25 04:12:44.8803+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aada6482-9603-481e-83fb-5000e6dd69d3', '{"action":"login","actor_id":"d1bf5bf0-81bf-4e4c-b2c0-78cf68267d02","actor_username":"jramirezeng03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:12:44.888216+00', ''),
	('00000000-0000-0000-0000-000000000000', '81023790-b75c-4aeb-ad1f-66b88e6afcfe', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:15:02.892962+00', ''),
	('00000000-0000-0000-0000-000000000000', '92444b67-4254-42a1-941b-2656fa4cdd54', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:15:05.187073+00', ''),
	('00000000-0000-0000-0000-000000000000', '337438ac-b995-49ec-ac48-8288b4258755', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:15:09.636141+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e37e4c05-7ba6-414a-a871-73ff239e8f7b', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:15:09.905877+00', ''),
	('00000000-0000-0000-0000-000000000000', '052072eb-7720-405c-a758-dc9067a505fd', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:15:10.167993+00', ''),
	('00000000-0000-0000-0000-000000000000', '0dfff84b-ceb9-4083-a57c-47f1bd50d918', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:15:32.16708+00', ''),
	('00000000-0000-0000-0000-000000000000', '3b8c70e6-0bfe-4fec-9728-8ba1e5ac9694', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:15:33.5287+00', ''),
	('00000000-0000-0000-0000-000000000000', '3379ef04-8096-4aff-b7b9-81c586378bde', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:15:33.710256+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b3b31f2b-baef-4957-8bdc-c7f0ec232b0c', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:15:39.255632+00', ''),
	('00000000-0000-0000-0000-000000000000', '45bd8552-c132-44d5-8a7a-0d9acca9ab3b', '{"action":"login","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:15:49.858076+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ff57d27c-91fa-40a5-8f8c-eae38757e50d', '{"action":"login","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:15:51.929244+00', ''),
	('00000000-0000-0000-0000-000000000000', '9645918e-ecee-48e4-a0fc-ac9286dc9c0c', '{"action":"login","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:15:52.547875+00', ''),
	('00000000-0000-0000-0000-000000000000', 'beab6e96-e3a2-4992-9930-9e6084c733f8', '{"action":"login","actor_id":"47e9e9c8-1e35-4dda-84e2-520ded728ec2","actor_username":"misrrafan777@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:15:53.715559+00', ''),
	('00000000-0000-0000-0000-000000000000', '193b1275-6f4b-4fe1-a283-b3b50fa3c935', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:16:26.380047+00', ''),
	('00000000-0000-0000-0000-000000000000', '0a44bece-16e4-47b1-8c46-2f9732ae4059', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:16:29.083983+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b30917cb-3323-4560-ae20-10b7fb20bf80', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:16:29.733355+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cb1d6b40-fe37-48fc-80ab-dbef8955de5b', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:18:07.427261+00', ''),
	('00000000-0000-0000-0000-000000000000', '60d22c4a-de3c-4865-8ef5-ea0c7ff21b59', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:18:09.153019+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dc36f40f-3192-4b68-8792-688a7265a948', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:18:17.379173+00', ''),
	('00000000-0000-0000-0000-000000000000', '949d4e9b-1ac6-405d-b462-17fee82c3317', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:18:17.629463+00', ''),
	('00000000-0000-0000-0000-000000000000', '12bc2705-99d2-4d80-a4c9-a8caf19dd7bc', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:18:46.823467+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b5d735d7-e3d8-422f-8602-4e84cffad987', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:21:55.012178+00', ''),
	('00000000-0000-0000-0000-000000000000', '255dee62-3851-41b6-9f11-e5bda5eb1f8f', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:26:35.124497+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e0eb865b-d763-432f-8b96-8ed75ed9b8f9', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:31:40.367297+00', ''),
	('00000000-0000-0000-0000-000000000000', '1ebbaa05-1137-4745-9ae4-88b71c2e9936', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:32:49.917377+00', ''),
	('00000000-0000-0000-0000-000000000000', '59f19b3a-d357-43dc-a0e4-44980d5d5b6f', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:32:55.06314+00', ''),
	('00000000-0000-0000-0000-000000000000', '43660fa5-8181-41b5-9d92-bdbe2609bacc', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:39:10.483611+00', ''),
	('00000000-0000-0000-0000-000000000000', '160878fc-654c-4023-9e9f-d8b463501b90', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-25 04:39:39.116789+00', ''),
	('00000000-0000-0000-0000-000000000000', '2c142d68-64f3-4a44-ac30-a95d39bf8b8e', '{"action":"token_refreshed","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-12-13 21:59:40.74863+00', ''),
	('00000000-0000-0000-0000-000000000000', '1260b4ec-5a2d-4da5-87de-efaa0deac133', '{"action":"token_revoked","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-12-13 21:59:40.756525+00', ''),
	('00000000-0000-0000-0000-000000000000', '06d9aaae-31a0-45c1-bbf4-55e60df8dead', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-12-13 22:11:41.056127+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ba68f5cd-6466-4381-b970-e40a2861b912', '{"action":"logout","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-12-13 22:19:21.558515+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ee9b6b32-feea-4d96-a5d3-ce9ce23f9c52', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-12-13 22:19:41.593362+00', ''),
	('00000000-0000-0000-0000-000000000000', '326156b6-e716-47ef-ac72-c7f1b535df3f', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-12-13 23:32:29.741037+00', ''),
	('00000000-0000-0000-0000-000000000000', '033950d9-f98d-4006-9e43-448a97b7c1a8', '{"action":"token_refreshed","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-12-13 23:55:07.236214+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b0401c37-7dd3-4819-b9c2-0f92f629af1b', '{"action":"token_revoked","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-12-13 23:55:07.250551+00', ''),
	('00000000-0000-0000-0000-000000000000', '87232490-9839-4dff-a5b8-183470aa88cb', '{"action":"login","actor_id":"c72f271e-ff5d-44d0-9dd8-4648a8eecc51","actor_username":"jramirezlopez03@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-12-29 16:34:43.507341+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") VALUES
	('f24b12c4-7fab-4994-96de-b32bc58b7f1e', '87b9edee-2a64-4b0d-825a-84a7fb13ffe5', '37cf808f-0a84-4413-b2c1-d7192e07a410', 's256', 'ohh3Jv5zlGrhIRghmEHnbNs1ywZE0Kb1EU6vryeCVBA', 'email', '', '', '2025-10-26 01:37:04.634418+00', '2025-10-26 01:37:04.634418+00', 'email/signup', NULL),
	('cb0e47cb-2d0c-4047-88a8-152a5bbbae32', '7f4851e7-95c0-47d5-86b1-dfbe75cd00a6', '5a620ec6-3235-445a-b71e-f84fa614e148', 's256', 'x1vgvw3Zt06yqPpS6AsDvu7npwkLvUiLixPHwadKUZ4', 'email', '', '', '2025-10-26 03:13:23.786115+00', '2025-10-26 03:13:23.786115+00', 'email/signup', NULL);


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'c72f271e-ff5d-44d0-9dd8-4648a8eecc51', 'authenticated', 'authenticated', 'jramirezlopez03@gmail.com', '$2a$10$nM7K8znBIXeyVnQxH0xQ6ObyJgcHzBiRxYmhoEbs0JPiPLx0SeZMa', '2025-10-29 01:53:01.40987+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-12-29 16:34:43.517496+00', '{"provider": "email", "providers": ["email"]}', '{"dob": "2003-12-10T07:00:00.000Z", "sub": "c72f271e-ff5d-44d0-9dd8-4648a8eecc51", "email": "jramirezlopez03@gmail.com", "last_name": "Ramirez Lopez", "first_name": "José Carlos", "email_verified": true, "phone_verified": false}', NULL, '2025-10-29 01:53:01.402089+00', '2025-12-29 16:34:43.537194+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '47e9e9c8-1e35-4dda-84e2-520ded728ec2', 'authenticated', 'authenticated', 'misrrafan777@gmail.com', '$2a$10$UxpnkSVHX3PPyPoUWim8nuu7vNi82b0GUEwN0rrnA6b8SiN2Pu5/u', '2025-11-23 00:35:11.787308+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-11-25 04:15:53.716326+00', '{"provider": "email", "providers": ["email"]}', '{"dob": "2002-07-10T06:00:00.000Z", "sub": "47e9e9c8-1e35-4dda-84e2-520ded728ec2", "email": "misrrafan777@gmail.com", "last_name": "Sanchez", "first_name": "Maria", "email_verified": true, "phone_verified": false}', NULL, '2025-11-23 00:35:11.510808+00', '2025-11-25 04:15:53.718086+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'd1bf5bf0-81bf-4e4c-b2c0-78cf68267d02', 'authenticated', 'authenticated', 'jramirezeng03@gmail.com', '$2a$10$1mT7pVXNWUM94Yg9MOfUwe8QPWRAExZoxUkpTx.iuVQxw.JLD9l6.', '2025-11-25 04:12:44.881289+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-11-25 04:12:44.88888+00', '{"provider": "email", "providers": ["email"]}', '{"dob": "2003-07-05T06:00:00.000Z", "sub": "d1bf5bf0-81bf-4e4c-b2c0-78cf68267d02", "email": "jramirezeng03@gmail.com", "last_name": "Ramirez", "first_name": "José Carlos", "email_verified": true, "phone_verified": false}', NULL, '2025-11-25 04:12:44.845276+00', '2025-11-25 04:12:44.890754+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('c72f271e-ff5d-44d0-9dd8-4648a8eecc51', 'c72f271e-ff5d-44d0-9dd8-4648a8eecc51', '{"dob": "2003-12-10T07:00:00.000Z", "sub": "c72f271e-ff5d-44d0-9dd8-4648a8eecc51", "email": "jramirezlopez03@gmail.com", "last_name": "Ramirez Lopez", "first_name": "José Carlos", "email_verified": false, "phone_verified": false}', 'email', '2025-10-29 01:53:01.406724+00', '2025-10-29 01:53:01.406778+00', '2025-10-29 01:53:01.406778+00', '2bc43e0c-c5cb-434c-8d07-3753669bbd99'),
	('47e9e9c8-1e35-4dda-84e2-520ded728ec2', '47e9e9c8-1e35-4dda-84e2-520ded728ec2', '{"dob": "2002-07-10T06:00:00.000Z", "sub": "47e9e9c8-1e35-4dda-84e2-520ded728ec2", "email": "misrrafan777@gmail.com", "last_name": "Sanchez", "first_name": "Maria", "email_verified": false, "phone_verified": false}', 'email', '2025-11-23 00:35:11.777994+00', '2025-11-23 00:35:11.778063+00', '2025-11-23 00:35:11.778063+00', 'ddb3c51c-0e10-408c-b919-069afee11e03'),
	('d1bf5bf0-81bf-4e4c-b2c0-78cf68267d02', 'd1bf5bf0-81bf-4e4c-b2c0-78cf68267d02', '{"dob": "2003-07-05T06:00:00.000Z", "sub": "d1bf5bf0-81bf-4e4c-b2c0-78cf68267d02", "email": "jramirezeng03@gmail.com", "last_name": "Ramirez", "first_name": "José Carlos", "email_verified": false, "phone_verified": false}', 'email', '2025-11-25 04:12:44.877359+00', '2025-11-25 04:12:44.877415+00', '2025-11-25 04:12:44.877415+00', '0a42a8aa-0832-4516-a55e-e0aad39ec55c');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('f80e01be-a7cf-427d-b993-7ecac95a7d41', 'c72f271e-ff5d-44d0-9dd8-4648a8eecc51', '2025-12-13 23:32:29.760731+00', '2025-12-13 23:32:29.760731+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '177.224.169.48', NULL, NULL, NULL, NULL, NULL),
	('a11c66f4-d51e-41b9-b34f-66f421884bf6', 'c72f271e-ff5d-44d0-9dd8-4648a8eecc51', '2025-12-29 16:34:43.517615+00', '2025-12-29 16:34:43.517615+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '177.224.169.38', NULL, NULL, NULL, NULL, NULL),
	('5b1f10c3-aff2-43aa-a68f-177588839e6d', '47e9e9c8-1e35-4dda-84e2-520ded728ec2', '2025-11-25 04:10:26.934385+00', '2025-11-25 04:10:26.934385+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '177.224.169.48', NULL, NULL, NULL, NULL, NULL),
	('5cb88969-6b40-4b9f-9426-85e8491e2e20', '47e9e9c8-1e35-4dda-84e2-520ded728ec2', '2025-11-25 04:10:39.657399+00', '2025-11-25 04:10:39.657399+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '177.224.169.48', NULL, NULL, NULL, NULL, NULL),
	('de609c0e-b201-4226-ba59-c8e796ccdda4', '47e9e9c8-1e35-4dda-84e2-520ded728ec2', '2025-11-25 04:10:25.89914+00', '2025-11-25 04:10:25.89914+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '177.224.169.48', NULL, NULL, NULL, NULL, NULL),
	('d1d53062-e59a-421a-b278-4f06f8f42407', 'd1bf5bf0-81bf-4e4c-b2c0-78cf68267d02', '2025-11-25 04:12:44.888988+00', '2025-11-25 04:12:44.888988+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '177.224.169.48', NULL, NULL, NULL, NULL, NULL),
	('f9b32d8b-7ffc-4368-8d91-423edbd6d62b', '47e9e9c8-1e35-4dda-84e2-520ded728ec2', '2025-11-25 04:15:49.85934+00', '2025-11-25 04:15:49.85934+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '177.224.169.48', NULL, NULL, NULL, NULL, NULL),
	('3d94be2d-4a08-4672-9d84-09e8b6ae25f4', '47e9e9c8-1e35-4dda-84e2-520ded728ec2', '2025-11-25 04:15:51.931931+00', '2025-11-25 04:15:51.931931+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '177.224.169.48', NULL, NULL, NULL, NULL, NULL),
	('4b348ee9-fc65-4119-a73c-e9dddf7d6b0c', '47e9e9c8-1e35-4dda-84e2-520ded728ec2', '2025-11-25 04:15:52.548876+00', '2025-11-25 04:15:52.548876+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '177.224.169.48', NULL, NULL, NULL, NULL, NULL),
	('432f7b78-9de9-4c5e-85bd-deeb577cf008', '47e9e9c8-1e35-4dda-84e2-520ded728ec2', '2025-11-25 04:15:53.71643+00', '2025-11-25 04:15:53.71643+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '177.224.169.48', NULL, NULL, NULL, NULL, NULL),
	('e7b86727-2860-4d63-b946-3f7554b7d0d0', 'c72f271e-ff5d-44d0-9dd8-4648a8eecc51', '2025-12-13 22:19:41.598993+00', '2025-12-13 23:55:07.274293+00', NULL, 'aal1', NULL, '2025-12-13 23:55:07.274159', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '177.224.169.48', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('f80e01be-a7cf-427d-b993-7ecac95a7d41', '2025-12-13 23:32:29.810562+00', '2025-12-13 23:32:29.810562+00', 'password', 'c58a595a-3dec-4dab-a69e-8090f6173903'),
	('a11c66f4-d51e-41b9-b34f-66f421884bf6', '2025-12-29 16:34:43.541386+00', '2025-12-29 16:34:43.541386+00', 'password', '2de7e155-8661-4f24-aeaf-2f3f32032e77'),
	('de609c0e-b201-4226-ba59-c8e796ccdda4', '2025-11-25 04:10:25.918309+00', '2025-11-25 04:10:25.918309+00', 'password', '6782174e-c88b-453b-86b6-ad1bdad130f1'),
	('5b1f10c3-aff2-43aa-a68f-177588839e6d', '2025-11-25 04:10:26.939062+00', '2025-11-25 04:10:26.939062+00', 'password', 'b8a6bcee-c1ed-40cc-8d8d-c43bdba1ed30'),
	('5cb88969-6b40-4b9f-9426-85e8491e2e20', '2025-11-25 04:10:39.662672+00', '2025-11-25 04:10:39.662672+00', 'password', '233f83b8-b918-4754-a00e-32b0ddb0c2ed'),
	('d1d53062-e59a-421a-b278-4f06f8f42407', '2025-11-25 04:12:44.891028+00', '2025-11-25 04:12:44.891028+00', 'password', '36a56541-82bc-47b1-b557-21f0a0cca501'),
	('f9b32d8b-7ffc-4368-8d91-423edbd6d62b', '2025-11-25 04:15:49.861428+00', '2025-11-25 04:15:49.861428+00', 'password', '5535d06f-c6f9-4310-a732-41aeedf32988'),
	('3d94be2d-4a08-4672-9d84-09e8b6ae25f4', '2025-11-25 04:15:51.934273+00', '2025-11-25 04:15:51.934273+00', 'password', '43b37b88-c2fa-4479-8c75-ed56f2b66a42'),
	('4b348ee9-fc65-4119-a73c-e9dddf7d6b0c', '2025-11-25 04:15:52.550915+00', '2025-11-25 04:15:52.550915+00', 'password', '40700171-612e-4f5b-928e-8fa68b91b5d8'),
	('432f7b78-9de9-4c5e-85bd-deeb577cf008', '2025-11-25 04:15:53.718336+00', '2025-11-25 04:15:53.718336+00', 'password', 'bccd8313-b5c7-46af-aa8b-f62c1499f63a'),
	('e7b86727-2860-4d63-b946-3f7554b7d0d0', '2025-12-13 22:19:41.609619+00', '2025-12-13 22:19:41.609619+00', 'password', 'fb7e36bc-fcc4-4812-ad8e-d040f68618a2');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 115, 'zpmw24463dcf', 'c72f271e-ff5d-44d0-9dd8-4648a8eecc51', false, '2025-12-13 23:32:29.786311+00', '2025-12-13 23:32:29.786311+00', NULL, 'f80e01be-a7cf-427d-b993-7ecac95a7d41'),
	('00000000-0000-0000-0000-000000000000', 117, 'ai4dpi6ielh7', 'c72f271e-ff5d-44d0-9dd8-4648a8eecc51', false, '2025-12-29 16:34:43.526882+00', '2025-12-29 16:34:43.526882+00', NULL, 'a11c66f4-d51e-41b9-b34f-66f421884bf6'),
	('00000000-0000-0000-0000-000000000000', 62, 'mi3ugbscrerm', '47e9e9c8-1e35-4dda-84e2-520ded728ec2', false, '2025-11-25 04:10:25.913347+00', '2025-11-25 04:10:25.913347+00', NULL, 'de609c0e-b201-4226-ba59-c8e796ccdda4'),
	('00000000-0000-0000-0000-000000000000', 63, 'di2o3ozyucn7', '47e9e9c8-1e35-4dda-84e2-520ded728ec2', false, '2025-11-25 04:10:26.936713+00', '2025-11-25 04:10:26.936713+00', NULL, '5b1f10c3-aff2-43aa-a68f-177588839e6d'),
	('00000000-0000-0000-0000-000000000000', 64, 'yfrlp2xnqqb4', '47e9e9c8-1e35-4dda-84e2-520ded728ec2', false, '2025-11-25 04:10:39.658999+00', '2025-11-25 04:10:39.658999+00', NULL, '5cb88969-6b40-4b9f-9426-85e8491e2e20'),
	('00000000-0000-0000-0000-000000000000', 114, 'sfjbmaxq7vr7', 'c72f271e-ff5d-44d0-9dd8-4648a8eecc51', true, '2025-12-13 22:19:41.60435+00', '2025-12-13 23:55:07.252622+00', NULL, 'e7b86727-2860-4d63-b946-3f7554b7d0d0'),
	('00000000-0000-0000-0000-000000000000', 116, '7z66rrkgkbyj', 'c72f271e-ff5d-44d0-9dd8-4648a8eecc51', false, '2025-12-13 23:55:07.26248+00', '2025-12-13 23:55:07.26248+00', 'sfjbmaxq7vr7', 'e7b86727-2860-4d63-b946-3f7554b7d0d0'),
	('00000000-0000-0000-0000-000000000000', 83, 'd6jw7s4p5s27', 'd1bf5bf0-81bf-4e4c-b2c0-78cf68267d02', false, '2025-11-25 04:12:44.889765+00', '2025-11-25 04:12:44.889765+00', NULL, 'd1d53062-e59a-421a-b278-4f06f8f42407'),
	('00000000-0000-0000-0000-000000000000', 93, '53x5eiubzyo6', '47e9e9c8-1e35-4dda-84e2-520ded728ec2', false, '2025-11-25 04:15:49.860098+00', '2025-11-25 04:15:49.860098+00', NULL, 'f9b32d8b-7ffc-4368-8d91-423edbd6d62b'),
	('00000000-0000-0000-0000-000000000000', 94, '2dn75aucpuuq', '47e9e9c8-1e35-4dda-84e2-520ded728ec2', false, '2025-11-25 04:15:51.932825+00', '2025-11-25 04:15:51.932825+00', NULL, '3d94be2d-4a08-4672-9d84-09e8b6ae25f4'),
	('00000000-0000-0000-0000-000000000000', 95, 'iq6j5hjn4stj', '47e9e9c8-1e35-4dda-84e2-520ded728ec2', false, '2025-11-25 04:15:52.549595+00', '2025-11-25 04:15:52.549595+00', NULL, '4b348ee9-fc65-4119-a73c-e9dddf7d6b0c'),
	('00000000-0000-0000-0000-000000000000', 96, 'yqzve5ntrprz', '47e9e9c8-1e35-4dda-84e2-520ded728ec2', false, '2025-11-25 04:15:53.717159+00', '2025-11-25 04:15:53.717159+00', NULL, '432f7b78-9de9-4c5e-85bd-deeb577cf008');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: admin_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."admin_roles" ("id", "user_id", "role_type", "created_at") VALUES
	('1ce07646-4a72-44a1-9f1e-6683dec1c925', 'c72f271e-ff5d-44d0-9dd8-4648a8eecc51', 'super_admin', '2025-11-24 20:16:28.435586+00');


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "first_name", "last_name", "email", "dob", "role") VALUES
	('c72f271e-ff5d-44d0-9dd8-4648a8eecc51', 'José Carlos', 'Ramirez Lopez', 'jramirezlopez03@gmail.com', NULL, 'admin'),
	('47e9e9c8-1e35-4dda-84e2-520ded728ec2', 'Maria', 'Sanchez', 'misrrafan777@gmail.com', NULL, 'user'),
	('d1bf5bf0-81bf-4e4c-b2c0-78cf68267d02', 'José Carlos', 'Ramirez', 'jramirezeng03@gmail.com', NULL, 'user');


--
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('product_images', 'product_images', NULL, '2025-10-23 05:00:17.380153+00', '2025-10-23 05:00:17.380153+00', true, false, NULL, NULL, NULL, 'STANDARD'),
	('category_images', 'category_images', NULL, '2025-10-23 05:00:23.974598+00', '2025-10-23 05:00:23.974598+00', true, false, NULL, NULL, NULL, 'STANDARD'),
	('collection_images', 'collection_images', NULL, '2025-10-23 05:00:31.528963+00', '2025-10-23 05:00:31.528963+00', true, false, NULL, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 117, true);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."audit_logs_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict Ivfv3nDwIG39n6avdzbKf0V2tStavcwa3QyAOewdWJm3HSywB5nWxS884MOGeDG

RESET ALL;

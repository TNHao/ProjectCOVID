--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.1

-- Started on 2021-12-29 13:06:22

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 209 (class 1259 OID 24577)
-- Name: Account; Type: TABLE; Schema: public; Owner: postgres
--


CREATE TABLE public."Payment_Account" (
    account_id integer NOT NULL,
    balance bigint NOT NULL,
    password character varying(256)
);




CREATE TABLE public."Transaction" (
    transaction_id integer NOT NULL,
    send_id integer NOT NULL,
    amount integer NOT NULL,
    create_at timestamp without time zone NOT NULL,
    action character(6) NOT NULL
);




--
-- TOC entry 3237 (class 2606 OID 24686)
-- Name: Payment_Account Payment Account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment_Account"
    ADD CONSTRAINT "Payment Account_pkey" PRIMARY KEY (account_id);



--
-- TOC entry 3239 (class 2606 OID 24691)
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (transaction_id);



-- Completed on 2021-12-29 13:06:22

--
-- PostgreSQL database dump complete
--


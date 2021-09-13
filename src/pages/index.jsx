import React, { useCallback, useState, useContext } from "react";
import Head from "next/head";
import router from "next/dist/client/router";
import { useAuth } from "../Context/hooks/useAuth";

import Logo from "../assets/logo2.svg";

import {
  Container,
  Title,
  LoginContainer,
  HeaderContainer,
  InputContainer,
  Input,
  Label,
  InputButton,
  Form,
  ErrorMessage,
} from "../styles/pages/signIn";
import loginSchema from "../utils/loginSchema";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setloginError] = useState(false);
  const { handleLogin } = useAuth();

  const validateLoginSchema = async (requestBody) => {
    try {
      await loginSchema.validate(requestBody);
    } catch (err) {
      throw new Error(err.errors);
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const requestBody = { email, password };
      await validateLoginSchema(requestBody);
      await handleLogin(email, password);
      setloginError(false);
      router.push("/home");
    } catch (error) {
      setloginError(true);
    }
  }

  return (
    <Container>
      <Head>
        <title>ioasys Books | Sign In</title>
      </Head>
      <LoginContainer>
        <HeaderContainer>
          <Logo />
          <Title>Books</Title>
        </HeaderContainer>
        <Form>
          <InputContainer>
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              type="text"
              id="email"
              onChange={(event) => setEmail(event.target.value)}
            ></Input>
          </InputContainer>

          <InputContainer>
            <Label htmlFor="password">Senha</Label>
            <Input
              name="password"
              type="password"
              id="password"
              autoComplete="off"
              onChange={(event) => setPassword(event.target.value)}
            ></Input>
            <InputButton type="submit" value="Entrar" onClick={handleSubmit} />
          </InputContainer>
        </Form>
        {loginError && (
          <ErrorMessage>Email e/ou senha incorretos.</ErrorMessage>
        )}
      </LoginContainer>
    </Container>
  );
}

export default Login;

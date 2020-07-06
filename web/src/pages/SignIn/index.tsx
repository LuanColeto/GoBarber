import React from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';

import { Form } from '@unform/web';
import Logo from '../../assets/logo.svg';

import Input from '../../components/input';
import Button from '../../components/button';

import { Container, Content, Background } from './styles';

const SignIn: React.FC = () => {
  function handleSubmit(data: object): void {
    console.log(data);
  }

  return (
    <Container>
      <Content>
        <img src={Logo} alt="GoBarber" />

        <Form onSubmit={handleSubmit}>
          <h1>Faça seu Login</h1>

          <Input name="email" icon={FiMail} placeholder="E-mail" />

          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Senha"
          />

          <Button type="submit">Entrar</Button>

          <a href="/forgot">Esqueci minha senha</a>
        </Form>

        <a href="/signup">
          <FiLogIn />
          Criar conta
        </a>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;

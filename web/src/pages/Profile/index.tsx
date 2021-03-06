import React, { useCallback, useRef, ChangeEvent } from 'react';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';


import Input from '../../components/input';
import Button from '../../components/button';

import { Container, Content, AvatarInput } from './styles';

interface ProfileData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { user, updateUser } = useAuth()


  const handleSubmit = useCallback(async (data: ProfileData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatóio'),
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('E-mail inválido'),
        password: Yup.string().when('old_password', {
          is: val => !!val.length,
          then: Yup.string().required(),
          otherWise: Yup.string()
        }),
        old_password: Yup.string(),
        password_confirmation: Yup.string().when('old_password', {
          is: val => !!val.length,
          then: Yup.string().required(),
          otherWise: Yup.string()
        }).oneOf(
          [Yup.ref('password')],
          'Confirmação incorreta',
        )
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const { name, email, old_password, password, password_confirmation } = data

      const formData = {
        name,
        email,
        ...(old_password
          ? {
            old_password,
            password,
            password_confirmation,
          }
          : {})
      }

      const response = await api.put('/profile', formData);

      updateUser(response.data)

      history.push('/dashboard')

      addToast({
        type: 'success',
        title: 'Perfil Atualizado',
        description: 'Suas informações do perfil foram atualizadas com sucesso'
      });

    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return ;
      }
      addToast({
        type: 'error',
        title: 'Erro na atualização do perfil',
        description: 'Ocorreu um erro ao atualizar o perfil, tente novamente',
      });
    }
  }, [addToast, history, updateUser]);


  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const data = new FormData();

      data.append('avatar', e.target.files[0])

      api.patch('/users/avatar', data).then((response) => {
        updateUser(response.data)

        addToast({
          type: 'success',
          title: 'Avatar atualizado'
        })
      });
    }
  }, [addToast, updateUser])

  return (
    <Container>

      <header>
        <div>
          <Link to="">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
          <Form ref={formRef} initialData={{
            name: user.name,
            email: user.email
          }} onSubmit={handleSubmit}>
            <AvatarInput>
              <img src={user.avatar_url} alt={user.name} />

              <label htmlFor="avatar">
                <FiCamera />

                <input type="file" id="avatar" onChange={handleAvatarChange} />
              </label>
            </AvatarInput>

            <h1>Meu Perfil</h1>

            <Input name="name" icon={FiUser} placeholder="Nome" />

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Input
              containerStyle={{ marginTop: 24 }}
              name="old_password"
              icon={FiLock}
              type="password"
              placeholder="Senha atual"
            />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
            />

            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmação de senha"
            />

            <Button type="submit">Confirmar mudanças</Button>
          </Form>
      </Content>
    </Container>
  );
};

export default Profile;

import React, { useState, useEffect, useContext } from "react";
import Head from 'next/head'
import api from "../services/api";
import Cards from "../components/Card";
import getTokenApi from "../utils/getToken";
import { useAuth } from '../Context/hooks/useAuth'


import {
  CardsBox,
  Container,
  LogoutContainer,
  LogoutIcon,
  LogoContainer,
  Header,
  Welcome,
  WelcomeContainer,
  ButtonLeft,
  ButtonRight,
  Button,
  ButtonContainer,
  Pagination,
} from "../styles/pages/home";

import Logo from '../assets/logo.svg'


export default function Home() {
  const [booksData, setBooksData] = useState({ data: [] });
  const [pageLength, setPageLenght] = useState(0);
  const [page, setPage] = useState(1);
  const [user, setUser] = useState("");
  const { handleLogout } = useAuth()


  useEffect(() => {
    (async () => {
      const responseToken = await getToken();
      await getBooks(responseToken);
      setUser(JSON.parse(localStorage.getItem("@ioasys-books:name")));
    })();
  }, []);

  const getToken = async () => {
    try {
      return await getTokenApi();
    } catch (err) {
      handleLogout();
    }
  };

  const getBooks = async (responseToken) => {
    try {
      const { data } = await api.get("books", {
        headers: {
          Authorization: `Bearer ${JSON.parse(responseToken.token)}`,
        },
        params: {
          page,
          amount: 12,
        },
      });
      setPageLenght(Math.ceil(data.totalPages));
      setBooksData(data);
    } catch (err) {
      handleLogout();
    }
  };

  const prevPage = () => {
    if (page - 1 > 0) {
      setPage(page - 1);
    }
  };

  const nextPage = () => {
    if (page + 1 <= pageLength) {
      setPage(page + 1);
    }
  };

  useEffect(async () => {
    const responseToken = await getToken();
    await getBooks(responseToken);
  }, [page]);

  return (
    <Container>
      <Head>
        <title>ioasys Books | Home</title>
      </Head>
      <Header>
        <LogoContainer>
          <Logo />
          <span>Books</span>
        </LogoContainer>

        <WelcomeContainer>
          <Welcome>
            Bem vindo, <strong>{user}!</strong>
          </Welcome>
          <LogoutContainer onClick={handleLogout}>
            <LogoutIcon />
          </LogoutContainer>
        </WelcomeContainer>
      </Header>

      <CardsBox>
        {booksData.data.map((book) => (
          <Cards
            key={book.id}
            imageUrl={book.imageUrl}
            title={book.title}
            authors={book.authors}
            pageCount={book.pageCount}
            publisher={book.publisher}
            published={book.published}
            bookID={book.id}
          />
        ))}
      </CardsBox>

      <ButtonContainer>
        <Pagination>
          Página <strong>{page}</strong> de <strong>{pageLength}</strong>
        </Pagination>
        <Button>
          <ButtonLeft
            disabled={!booksData || booksData.currentPage <= 1}
            onClick={prevPage}
          />
        </Button>
        <Button>
          <ButtonRight
            disabled={
              !booksData || booksData.currentPage >= booksData.totalPages
            }
            onClick={nextPage}
          />
        </Button>
      </ButtonContainer>
    </Container>
  );
}

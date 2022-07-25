import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Box from "@mui/material/Box";
import TextField, { BaseTextFieldProps } from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const regInputRef = useRef<BaseTextFieldProps>();
  const passcodeInputRef = useRef<BaseTextFieldProps>();

  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    setSubmitting(true);
    const regno = regInputRef.current?.value;
    const passcode = passcodeInputRef.current?.value;
    if (regno === "") {
      setError("Regno missing");
      setSubmitting(false);
      return;
    }
    if (passcode === "") {
      setError("Passcode missing");
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.post("/api/signin", {
        regno,
        passcode,
      });
      localStorage.setItem("token", response.data.token);
      setError("");
      router.replace("/elective-selection");
    } catch (err: any) {
      setError(err.response.data.message);
    }

    setSubmitting(false);
  };

  return (
    <div className={styles.container}>
      
      <Head>
        <html lang="en"></html>
        <title>Elective Selection App | CSE | SMIT</title>
        <meta
          name="description"
          content="App to get the students priority for elective subjects for 5th semester and 7th semester"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">CSE</a>
        </h1>

        <p className={styles.description}>Get started by loggin in</p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Regno</h2>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { mb: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="regno"
                label="Regno"
                variant="outlined"
                type="number"
                inputRef={regInputRef}
                disabled={submitting}
              />
            </Box>
            <h2>Passcode</h2>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { mb: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="passcode"
                label="Passcode"
                variant="outlined"
                inputRef={passcodeInputRef}
                disabled={submitting}
              />
            </Box>
            <Box
              sx={{
                "& > :not(style)": { m: 1, width: "25ch" },
              }}
            >
              <Button
                variant="outlined"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <CircularProgress color="info" size="1.1rem" />
                ) : (
                  "Signin"
                )}
              </Button>
            </Box>
            {error !== "" && (
              <Alert severity="error">
                <AlertTitle>{error}</AlertTitle>
              </Alert>
            )}
          </div>

          <div className={styles.card}>
            <h2>Rules</h2>
            <ul>
              <li>Subjects will be allocated based on CGPA</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm, Resolver } from "react-hook-form";
import styles from "./ElectiveSelection.module.css";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";

type Props = {};

type FormValues = {
    option1_1: string;
    option1_2: string;
    option1_3?: string;
    option1_4?: string;
    option1_5?: string;
    option2_1: string;
    option2_2: string;
    option2_3?: string;
    option2_4?: string;
    option2_5?: string;
};

const ElectiveSelection = (props: Props) => {
    const [userData, setUserData] = useState<any>();
    const [optionList1, setOptionList1] = useState<Array<string>>([]);
    const [optionList2, setOptionList2] = useState<string[]>([]);
    const router = useRouter();

    const [initialLoading, setInitialLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [option1_1, setOption1_1] = useState("");
    const [option1_2, setOption1_2] = useState("");
    const [option1_3, setOption1_3] = useState("");
    const [option1_4, setOption1_4] = useState("");
    const [option1_5, setOption1_5] = useState("");
    const [option2_1, setOption2_1] = useState("");
    const [option2_2, setOption2_2] = useState("");
    const [option2_3, setOption2_3] = useState("");
    const [option2_4, setOption2_4] = useState("");
    const [option2_5, setOption2_5] = useState("");

    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios
                .post("/api/getUserData", {
                    token: localStorage.getItem("token"),
                })
                .then((response) => {
                    setUserData(response.data.data);
                    setInitialLoading(false);
                    console.log(response.data.data);
                    if (response.data.data.current_sem === 7) {
                        setOptionList1(response.data.data.elective_7_options);
                        setOptionList2(response.data.data.elective_8_options);
                    } else if (response.data.data.current_sem === 5) {
                        setOptionList1(response.data.data.elective_3_options);
                        setOptionList2(response.data.data.elective_4_options);
                    }
                });
        } else if (!localStorage.getItem("token")) {
            router.replace("/");
        }
    }, []);

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const handleChange = (event: SelectChangeEvent, optionLabel: string) => {
        switch (optionLabel) {
            case "option1_1":
                setOption1_1(event.target.value);
                break;
            case "option1_2":
                setOption1_2(event.target.value);
                break;
            case "option1_3":
                setOption1_3(event.target.value);
                break;
            case "option1_4":
                setOption1_4(event.target.value);
                break;
            case "option1_5":
                setOption1_5(event.target.value);
                break;
            case "option2_1":
                setOption2_1(event.target.value);
                break;
            case "option2_2":
                setOption2_2(event.target.value);
                break;
            case "option2_3":
                setOption2_3(event.target.value);
                break;
            case "option2_4":
                setOption2_4(event.target.value);
                break;
            case "option2_5":
                setOption2_5(event.target.value);
                break;
        }
    };

    const disable_option_1 = (option: string) => {
        if (
            option === option1_1 ||
            option === option1_2 ||
            option === option1_3 ||
            option === option1_4 ||
            option === option1_5
        ) {
            return true;
        } else return false;
    };

    const disable_option_2 = (option: string) => {
        if (
            option === option2_1 ||
            option === option2_2 ||
            option === option2_3 ||
            option === option2_4 ||
            option === option2_5
        ) {
            return true;
        } else return false;
    };

    const handleSubmit = async () => {
        console.log(
            option1_1,
            option1_2,
            option1_3,
            option1_4,
            option2_1,
            option2_2,
            option2_3,
            option2_4
        );
        setSubmitting(true);
        try {
            const response = await axios.post("/api/submitElective", {
                regNo: userData.regNo,
                sem: userData.current_sem,
                option1_1,
                option1_2,
                option1_3,
                option1_4,
                option2_1,
                option2_2,
                option2_3,
                option2_4,
            });
            if (response) {
                console.log(response);
                setSubmitted(true);
            }
            setSubmitting(false);
            localStorage.removeItem("token");
        } catch (err) {
            setSubmitting(false);
        }
    };

    return (
        <>
            {initialLoading && (
                <div
                    style={{
                        display: "flex",
                        margin: "auto",
                        width: "100vw",
                        height: "100vh",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    className={styles["animate-charcter"]}
                >
                    <p>Loading resources...</p>
                </div>
            )}
            <div className={styles["main-grid"]}>
                {!initialLoading && (
                    <>
                        <div className={styles["info-section"]}>
                            <div className={styles["info-card"]}>
                                <p>
                                    <span style={{ color: "black" }}>
                                        Welcome
                                    </span>{" "}
                                    {userData?.name} <br />
                                </p>
                                <p>
                                    <span style={{ color: "black" }}>
                                        Registration no:
                                    </span>{" "}
                                    {userData?.regNo}
                                </p>
                                <span style={{ fontSize: "0.8rem" }}>
                                    Your CGPA in the database
                                </span>
                                <h2>
                                    {userData && userData.cgpa
                                        ? userData.cgpa.toFixed(3)
                                        : "Data Missing"}{" "}
                                </h2>
                                <span style={{ fontSize: "0.7rem" }}>
                                    **The higher your CGPA, the more likely you
                                    are to get your preferred subject <br />
                                    Option 1 will have highest priority in the
                                    allotment for each elective.
                                </span>
                                {userData && !userData.cgpa && (
                                    <span
                                        style={{
                                            display: "block",
                                            fontSize: "0.6rem",
                                        }}
                                    >
                                        Please contact admin to update your cgpa
                                    </span>
                                )}
                            </div>
                        </div>
                        {/* Form section */}
                        <div className={styles["main-section"]}>
                            {submitted && <h2>Thank you for submitting.</h2>}
                            {!submitted && (
                                <Stepper
                                    activeStep={activeStep}
                                    orientation="vertical"
                                >
                                    <Step>
                                        <StepLabel>
                                            {userData &&
                                            userData?.current_sem === 7
                                                ? "Elective VII"
                                                : "Elective III"}
                                        </StepLabel>
                                        <StepContent>
                                            <Box
                                                sx={{
                                                    minWidth: 120,
                                                    mb: 2,
                                                    mt: 2,
                                                }}
                                            >
                                                <FormControl fullWidth>
                                                    <InputLabel id="option-1-1-label">
                                                        Option 1
                                                    </InputLabel>
                                                    <Select
                                                        labelId="option-1-1-label"
                                                        id="option-1-1"
                                                        label="Option 1"
                                                        value={option1_1}
                                                        onChange={(e) =>
                                                            handleChange(
                                                                e,
                                                                "option1_1"
                                                            )
                                                        }
                                                    >
                                                        {optionList1?.map(
                                                            (option, index) => (
                                                                <MenuItem
                                                                    value={
                                                                        option
                                                                    }
                                                                    key={index}
                                                                    disabled={disable_option_1(
                                                                        option
                                                                    )}
                                                                >
                                                                    {option}
                                                                </MenuItem>
                                                            )
                                                        )}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            {optionList1?.length > 1 && (
                                                <Box
                                                    sx={{
                                                        minWidth: 120,
                                                        mb: 2,
                                                    }}
                                                >
                                                    <FormControl fullWidth>
                                                        <InputLabel id="option-1-2-label">
                                                            Option 2
                                                        </InputLabel>
                                                        <Select
                                                            labelId="option-1-2-label"
                                                            id="option-1-2"
                                                            label="Option 2"
                                                            value={option1_2}
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    e,
                                                                    "option1_2"
                                                                )
                                                            }
                                                        >
                                                            {optionList1?.map(
                                                                (
                                                                    option,
                                                                    index
                                                                ) => (
                                                                    <MenuItem
                                                                        value={
                                                                            option
                                                                        }
                                                                        key={
                                                                            index
                                                                        }
                                                                        disabled={disable_option_1(
                                                                            option
                                                                        )}
                                                                    >
                                                                        {option}
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                            )}
                                            {optionList1.length > 2 && (
                                                <Box
                                                    sx={{
                                                        minWidth: 120,
                                                        mb: 2,
                                                    }}
                                                >
                                                    <FormControl fullWidth>
                                                        <InputLabel id="option-1-3-label">
                                                            Option 3
                                                        </InputLabel>
                                                        <Select
                                                            labelId="option-1-3-label"
                                                            id="option-1-3"
                                                            label="Option 3"
                                                            value={option1_3}
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    e,
                                                                    "option1_3"
                                                                )
                                                            }
                                                        >
                                                            {optionList1?.map(
                                                                (
                                                                    option,
                                                                    index
                                                                ) => (
                                                                    <MenuItem
                                                                        value={
                                                                            option
                                                                        }
                                                                        key={
                                                                            index
                                                                        }
                                                                        disabled={disable_option_1(
                                                                            option
                                                                        )}
                                                                    >
                                                                        {option}
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                            )}
                                            {optionList1.length > 3 && (
                                                <Box
                                                    sx={{
                                                        minWidth: 120,
                                                        mb: 2,
                                                    }}
                                                >
                                                    <FormControl fullWidth>
                                                        <InputLabel id="option-1-4-label">
                                                            Option 4
                                                        </InputLabel>
                                                        <Select
                                                            labelId="option-1-4-label"
                                                            id="option-1-4"
                                                            label="Option 4"
                                                            value={option1_4}
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    e,
                                                                    "option1_4"
                                                                )
                                                            }
                                                        >
                                                            {optionList1?.map(
                                                                (
                                                                    option,
                                                                    index
                                                                ) => (
                                                                    <MenuItem
                                                                        value={
                                                                            option
                                                                        }
                                                                        key={
                                                                            index
                                                                        }
                                                                        disabled={disable_option_1(
                                                                            option
                                                                        )}
                                                                    >
                                                                        {option}
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                            )}
                                            {optionList1.length > 4 && (
                                                <Box
                                                    sx={{
                                                        minWidth: 120,
                                                        mb: 2,
                                                    }}
                                                >
                                                    <FormControl fullWidth>
                                                        <InputLabel id="option-1-4-label">
                                                            Option 5
                                                        </InputLabel>
                                                        <Select
                                                            labelId="option-1-5-label"
                                                            id="option-1-5"
                                                            label="Option 5"
                                                            value={option1_5}
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    e,
                                                                    "option1_5"
                                                                )
                                                            }
                                                        >
                                                            {optionList1?.map(
                                                                (
                                                                    option,
                                                                    index
                                                                ) => (
                                                                    <MenuItem
                                                                        value={
                                                                            option
                                                                        }
                                                                        key={
                                                                            index
                                                                        }
                                                                        disabled={disable_option_1(
                                                                            option
                                                                        )}
                                                                    >
                                                                        {option}
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                            )}
                                            <Box sx={{ mb: 2 }}>
                                                <div>
                                                    <Button
                                                        variant="contained"
                                                        type="button"
                                                        disabled={
                                                            option1_1 === "" ||
                                                            option1_2 === "" ||
                                                            (optionList1.length >
                                                                2 &&
                                                                option1_3 ===
                                                                    "") ||
                                                            (optionList1.length >
                                                                3 &&
                                                                option1_4 ===
                                                                    "")
                                                        }
                                                        onClick={handleNext}
                                                        sx={{ mt: 1, mr: 1 }}
                                                    >
                                                        Continue
                                                    </Button>
                                                </div>
                                            </Box>
                                        </StepContent>
                                    </Step>
                                    <Step>
                                        <StepLabel>
                                            {userData &&
                                            userData.current_sem === 7
                                                ? "Elective VIII"
                                                : "Elective IV"}
                                        </StepLabel>
                                        <StepContent>
                                            <Box
                                                sx={{
                                                    minWidth: 120,
                                                    mb: 2,
                                                    mt: 2,
                                                }}
                                            >
                                                <FormControl fullWidth>
                                                    <InputLabel id="option-2-1-label">
                                                        Option 1
                                                    </InputLabel>
                                                    <Select
                                                        labelId="option-2-1-label"
                                                        id="option-2-1"
                                                        label="Option 1"
                                                        value={option2_1}
                                                        onChange={(e) =>
                                                            handleChange(
                                                                e,
                                                                "option2_1"
                                                            )
                                                        }
                                                    >
                                                        {optionList2?.map(
                                                            (option, index) => (
                                                                <MenuItem
                                                                    value={
                                                                        option
                                                                    }
                                                                    key={index}
                                                                    disabled={disable_option_2(
                                                                        option
                                                                    )}
                                                                >
                                                                    {option}
                                                                </MenuItem>
                                                            )
                                                        )}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            {optionList2?.length > 1 && (
                                                <Box
                                                    sx={{
                                                        minWidth: 120,
                                                        mb: 2,
                                                    }}
                                                >
                                                    <FormControl fullWidth>
                                                        <InputLabel id="option-2-2-label">
                                                            Option 2
                                                        </InputLabel>
                                                        <Select
                                                            labelId="option-2-2-label"
                                                            id="option-1-2"
                                                            label="Option 2"
                                                            value={option2_2}
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    e,
                                                                    "option2_2"
                                                                )
                                                            }
                                                        >
                                                            {optionList2?.map(
                                                                (
                                                                    option,
                                                                    index
                                                                ) => (
                                                                    <MenuItem
                                                                        value={
                                                                            option
                                                                        }
                                                                        key={
                                                                            index
                                                                        }
                                                                        disabled={disable_option_2(
                                                                            option
                                                                        )}
                                                                    >
                                                                        {option}
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                            )}
                                            {optionList2.length > 2 && (
                                                <Box
                                                    sx={{
                                                        minWidth: 120,
                                                        mb: 2,
                                                    }}
                                                >
                                                    <FormControl fullWidth>
                                                        <InputLabel id="option-2-3-label">
                                                            Option 3
                                                        </InputLabel>
                                                        <Select
                                                            labelId="option-2-3-label"
                                                            id="option-2-3"
                                                            label="Option 3"
                                                            value={option2_3}
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    e,
                                                                    "option2_3"
                                                                )
                                                            }
                                                        >
                                                            {optionList2?.map(
                                                                (
                                                                    option,
                                                                    index
                                                                ) => (
                                                                    <MenuItem
                                                                        value={
                                                                            option
                                                                        }
                                                                        key={
                                                                            index
                                                                        }
                                                                        disabled={disable_option_2(
                                                                            option
                                                                        )}
                                                                    >
                                                                        {option}
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                            )}
                                            {optionList2.length > 3 && (
                                                <Box
                                                    sx={{
                                                        minWidth: 120,
                                                        mb: 2,
                                                    }}
                                                >
                                                    <FormControl fullWidth>
                                                        <InputLabel id="option-2-4-label">
                                                            Option 4
                                                        </InputLabel>
                                                        <Select
                                                            labelId="option-2-4-label"
                                                            id="option-2-4"
                                                            label="Option 4"
                                                            value={option2_4}
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    e,
                                                                    "option2_4"
                                                                )
                                                            }
                                                        >
                                                            {optionList2?.map(
                                                                (
                                                                    option,
                                                                    index
                                                                ) => (
                                                                    <MenuItem
                                                                        value={
                                                                            option
                                                                        }
                                                                        key={
                                                                            index
                                                                        }
                                                                        disabled={disable_option_2(
                                                                            option
                                                                        )}
                                                                    >
                                                                        {option}
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                            )}
                                            {optionList2.length > 4 && (
                                                <Box
                                                    sx={{
                                                        minWidth: 120,
                                                        mb: 2,
                                                    }}
                                                >
                                                    <FormControl fullWidth>
                                                        <InputLabel id="option-2-5-label">
                                                            Option 5
                                                        </InputLabel>
                                                        <Select
                                                            labelId="option-2-5-label"
                                                            id="option-2-5"
                                                            label="Option 5"
                                                            value={option2_5}
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    e,
                                                                    "option2_5"
                                                                )
                                                            }
                                                        >
                                                            {optionList2?.map(
                                                                (
                                                                    option,
                                                                    index
                                                                ) => (
                                                                    <MenuItem
                                                                        value={
                                                                            option
                                                                        }
                                                                        key={
                                                                            index
                                                                        }
                                                                        disabled={disable_option_2(
                                                                            option
                                                                        )}
                                                                    >
                                                                        {option}
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                            )}
                                            <Box sx={{ mb: 2 }}>
                                                <div>
                                                    <Button
                                                        variant="contained"
                                                        onClick={handleNext}
                                                        sx={{ mt: 1, mr: 1 }}
                                                        disabled={
                                                            option2_1 === "" ||
                                                            option2_2 === "" ||
                                                            (optionList2.length >
                                                                2 &&
                                                                option2_3 ===
                                                                    "") ||
                                                            (optionList2.length >
                                                                3 &&
                                                                option2_4 ===
                                                                    "")
                                                        }
                                                    >
                                                        Continue
                                                    </Button>
                                                    <Button
                                                        onClick={handleBack}
                                                        sx={{ mt: 1, mr: 1 }}
                                                    >
                                                        Back
                                                    </Button>
                                                </div>
                                            </Box>
                                        </StepContent>
                                    </Step>
                                    <Step>
                                        <StepLabel>Submit</StepLabel>
                                        <StepContent>
                                            <Box sx={{ mb: 2 }}>
                                                <div>
                                                    <Button
                                                        variant="contained"
                                                        onClick={handleSubmit}
                                                        sx={{ mt: 1, mr: 1 }}
                                                        disabled={submitting}
                                                    >
                                                        Submit
                                                    </Button>
                                                    <Button
                                                        onClick={handleBack}
                                                        sx={{ mt: 1, mr: 1 }}
                                                    >
                                                        Back
                                                    </Button>
                                                </div>
                                            </Box>
                                        </StepContent>
                                    </Step>
                                </Stepper>
                            )}
                        </div>

                        {/* Selection data section */}
                        <div className={styles["selection-data-section"]}>
                            Section
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default ElectiveSelection;

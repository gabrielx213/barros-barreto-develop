import {
  Button,
  Card,
  CardContent,
  TextField,
  Grid,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import MaskInput from "../../components/MaskInput";
import Notification from "../../components/Notification/Notification";
import api from "../../services/api";
import { components } from "./components";
import { validationSchema } from "./validationSchema";

const classes = {
  cardRoot: {
    margin: 20,
  },

  btnSubmit: {
    backgroundColor: "#1B98E0",
    color: "white",
    border: "1px solid rgba(0, 0, 0, 0.23)",
  },
  btnCancel: {
    backgroundColor: "#CFCFCF",
    color: "black",
    border: "1px solid rgba(0, 0, 0, 0.23)",
  },
};

const INITIAL_VALUE_NOTIFY = {
  isOpen: false,
  message: "",
  type: "",
  title: "",
};

const INITIAL_VALUE_FORMIK = {
  name: "",
  CNES: "",
  ctiPhone: "",
  onDutyPhone: "",
  cityname: "",
  statename: "",
};

export default function RegisterHospital() {
  const history = useHistory();
  const [notify, setNotify] = useState(INITIAL_VALUE_NOTIFY);

  const post = (values) => {
    const { confirmPassword, ...data } = values;
    api
      .post("hospitals", data)
      .then(onSubmitSuccessfully)
      .catch(onSubmitFailed);
  };


  const onSubmitSuccessfully = () => {
    setNotify({
      isOpen: true,
      message: "Hospital cadastrado com sucesso!",
      type: "success",
      title: "Hospital cadastrado!",
    });

    formik.resetForm()
  }

  const onSubmitFailed = (err) => {
    const message = err.response?.data?.error?.message;

    if (message) {
      setNotify({
        isOpen: true,
        message: message,
        type: "error",
        title: "Falha no cadastro!",
      });
    }
  }

  const formik = useFormik({
    initialValues: INITIAL_VALUE_FORMIK,
    validationSchema: validationSchema,
    onSubmit: post,
    enableReinitialize: true,
  });

  const textFieldFormik = ({ id, ...props }) => (
    <TextField
      size="small"
      fullWidth
      id={id}
      name={id}
      label={props.label || id}
      value={formik.values[id]}
      onChange={formik.handleChange}
      error={formik.touched[id] && Boolean(formik.errors[id])}
      helperText={formik.touched[id] && formik.errors[id]}
      required={true}
      {...props}
    />
  );

  const inputMaskFormik = ({ id, mask, useRawValue, ...props }) => (
    <MaskInput
      size="small"
      mask={mask}
      useRawValue={useRawValue}
      fullWidth
      id={id}
      name={id}
      label={props.label || id}
      value={formik.values[id]}
      onChange={formik.handleChange}
      error={formik.touched[id] && Boolean(formik.errors[id])}
      helperText={formik.touched[id] && formik.errors[id]}
      required={true}
      {...props}
    />
  );

  return (
    <Card style={classes.cardRoot}>
      <CardContent>
        <Typography
          variant="h5"
          align="center"
          style={{ fontWeight: "bold", marginBottom: 30 }}
        >
          Cadastro de Hospital
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              {textFieldFormik({ id: "name", label: "Nome" })}
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3}>
               {textFieldFormik({ id: "cityname", label: "Município" })}
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              {textFieldFormik({ id: "statename", label: "Estado" })}
            </Grid>

            <Grid item xs={12} sm={6} md={3} lg={3}>
              {inputMaskFormik({
                id: "CNES",
                label: "CNES",
                mask: "9999999",
                useRawValue: true,
              })}
            </Grid>

            <Grid item xs={12} sm={6} md={3} lg={3}>
              {inputMaskFormik({
                id: "ctiphone",
                label: "Telefone do CTI",
                mask: "(99) 99999-9999",
                useRawValue: true,
              })}
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6}>
              {inputMaskFormik({
                id: "onDutyphone",
                label: "Telefone do Plantão",
                mask: "(99) 99999-9999",
                useRawValue: true,
              })}
            </Grid>

            <Grid
              container
              spacing={2}
              style={{ marginTop: 10 }}
              justifyContent="center"
            >
              <Grid item>
                <Button
                  variant="outlined"
                  style={classes.btnCancel}
                  onClick={() => history.push("/choice-patient-monitoring")}
                >
                  Voltar
                </Button>
              </Grid>

              <Grid item>
                <Button
                  variant="outlined"
                  type="submit"
                  style={classes.btnSubmit}
                >
                  Cadastrar
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </CardContent>

      <Notification notify={notify} setNotify={setNotify} />
    </Card>
  );
}

import React, { Component } from "react";
import { Box, Button, CardContent, Divider, Grid, Stack, TextField, Typography } from "@mui/material";

interface HomeProps {}

interface HomeState {
  A: number;
  B: number;
  Ro: number;
  d: number;
  sInputs: { a: number; b: number }[];
}

export class Home extends Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      A: 0,
      B: 0,
      Ro: 0,
      d: 0,
      sInputs: [
        { a: 0, b: 0 },
        { a: 0, b: 0 },
      ],
    };
  }

  render(): JSX.Element {
    const tau2 = this._calculateTau2(this.state.A, this.state.B, this.state.d, this.state.Ro, this.state.sInputs);

    return (
      <Box sx={{ flexGrow: 1, verticalAlign: "center", p: 4 }} maxWidth="md">
        <Stack spacing={0}>
          <CardContent sx={{ width: "100%" }}>
            <Typography variant="h3" color="text.secondary" sx={{ mb: 1 }}>
              Исходные данные
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Основные коэффициенты
            </Typography>
            <Grid container spacing={2.5} alignContent="flex-start" alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Коэффициент A"
                  helperText="Габаритная ширина оконного блока, м"
                  id="A"
                  type="number"
                  defaultValue="0"
                  size="small"
                  value={this.state.A}
                  onChange={(e) => this.setState({ A: Number(e.target.value) })}
                  inputProps={{ step: "0.1" }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Коэффициент B "
                  helperText="Габаритная высота оконного блока, м"
                  id="B"
                  type="number"
                  defaultValue="0"
                  size="small"
                  value={this.state.B}
                  onChange={(e) => this.setState({ B: Number(e.target.value) })}
                  inputProps={{ step: "0.1" }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Коэффициент ρ"
                  helperText="Коэфф. Отражения внутренних граней ячеек переплета"
                  id="Ro"
                  type="number"
                  defaultValue="0"
                  size="small"
                  value={this.state.Ro}
                  onChange={(e) => this.setState({ Ro: Number(e.target.value) })}
                  inputProps={{ step: "0.1" }}
                />
              </Grid>
              <Grid item xs={12} md={6} />
              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Коэффициент d"
                  helperText="Суммарная толщина переплета, м"
                  id="d"
                  type="number"
                  defaultValue="0"
                  size="small"
                  value={this.state.d}
                  onChange={(e) => this.setState({ d: Number(e.target.value) })}
                  inputProps={{ step: "0.1" }}
                />
              </Grid>
            </Grid>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 3.5, mb: 1.5 }}>
              Коэффициенты ячеек
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              <b>
                a<sub>i</sub>
              </b>{" "}
              - габаритная ширина i-й ячейки в свету, м
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              <b>
                b<sub>i</sub>
              </b>{" "}
              - габаритная высота i-й ячейки в свету, м
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              <b>
                σ<sub>i</sub>
              </b>{" "}
              = 2d*(a<sub>i</sub> * b<sub>i</sub>)
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              <b>
                S<sub>i</sub>
              </b>{" "}
              = a<sub>i</sub> * b<sub>i</sub>
            </Typography>
            <Stack direction="row" spacing={2} sx={{ pb: 0, pt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  if (this.state.sInputs.length > 1) {
                    let newState = this.state.sInputs.map((inp) => ({ a: inp.a, b: inp.b }));
                    newState.pop();
                    this.setState({ sInputs: newState });
                  }
                }}
              >
                -
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  let newState = this.state.sInputs.map((inp) => ({ a: inp.a, b: inp.b }));
                  newState.push({ a: 0, b: 0 });
                  this.setState({ sInputs: newState });
                }}
              >
                +
              </Button>
            </Stack>
            {this.state.sInputs.map((s, index) => {
              const indexIncremented = index + 1;
              return (
                <Box sx={{ pt: 3 }} key={indexIncremented}>
                  <Grid container spacing={2} alignContent="flex-start" alignItems="center">
                    <Grid item xs={6} md={3}>
                      <TextField
                        sx={{ width: "100%" }}
                        label={
                          <>
                            a<sub>${indexIncremented}</sub>, м
                          </>
                        }
                        id={`a${indexIncremented}`}
                        type="number"
                        defaultValue="0"
                        size="small"
                        value={s.a}
                        onChange={(e) => {
                          let newState = this.state.sInputs.map((inp) => ({ a: inp.a, b: inp.b }));
                          newState[index].a = Number(e.target.value);
                          this.setState({ sInputs: newState });
                        }}
                        inputProps={{ step: "0.1" }}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField
                        sx={{ width: "100%" }}
                        label={
                          <>
                            b<sub>${indexIncremented}</sub>, м
                          </>
                        }
                        id={`b${indexIncremented}`}
                        type="number"
                        defaultValue="0"
                        size="small"
                        value={s.b}
                        onChange={(e) => {
                          let newState = this.state.sInputs.map((inp) => ({ a: inp.a, b: inp.b }));
                          newState[index].b = Number(e.target.value);
                          this.setState({ sInputs: newState });
                        }}
                        inputProps={{ step: "0.1" }}
                      />
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        gutterBottom
                        sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                      >
                        <strong>
                          σ<sub>{indexIncremented}</sub>
                        </strong>{" "}
                        ={this._calculateSigma(this.state.d, s)}м
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        gutterBottom
                        sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                      >
                        <strong>
                          S<sub>{indexIncremented}</sub>
                        </strong>{" "}
                        ={this._calculateSquare(s)}м<sup>2</sup>
                      </Typography>
                    </Grid>
                  </Grid>
                  {index < this.state.sInputs.length - 1 && (
                    <Divider sx={{ display: { xs: "block", md: "none" }, my: 1 }} />
                  )}
                </Box>
              );
            })}
          </CardContent>

          <CardContent sx={{ width: "100%" }}>
            <Typography variant="h3" color="text.secondary" gutterBottom sx={{ mb: 1 }}>
              Расчет
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Итоговые вычисления
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              gutterBottom
              sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: { xs: "unset", md: "wrap" } }}
            >
              <strong>
                S<sub>0</sub>
              </strong>{" "}
              - площадь светового проема в светы = <strong>A * B</strong> ={" "}
              {this._calculateSquare({ a: this.state.A, b: this.state.B })}м<sup>2</sup>
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              gutterBottom
              sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: { xs: "unset", md: "wrap" } }}
            >
              <strong>
                τ<sub>2</sub>
              </strong>{" "}
              - коэффициент, учитывающий потери света в переплетах ={" "}
              <strong>
                {Number.isFinite(tau2) ? (
                  <span style={{ color: "#43A047" }}>{tau2}</span>
                ) : (
                  <span style={{ color: "#E53935" }}>Не все коэффициенты указаны</span>
                )}
              </strong>
            </Typography>
          </CardContent>
        </Stack>
      </Box>
    );
  }

  private _calculateSigma = (d: number, s: { a: number; b: number }): string => {
    return (Math.round(2 * d * (s.a + s.b) * 10000) / 10000).toFixed(3);
  };

  private _calculateSquare = (s: { a: number; b: number }): string => {
    return (Math.round(s.a * s.b * 10000) / 10000).toFixed(3);
  };

  private _calculateTau2 = (
    A: number,
    B: number,
    d: number,
    Ro: number,
    sInputs: { a: number; b: number }[]
  ): number => {
    const S0 = A * B;
    let sInputsSum = 0;
    for (let { a, b } of sInputs) {
      const S = a * b;
      const sgm = 2 * d * (a + b);

      const sgmAndSSqrt = Math.sqrt(S * S + 0.25 * sgm * sgm);

      const firstBraces = sgmAndSSqrt - 0.5 * sgm;
      const numerator = Math.pow(S + 0.5 * sgm - sgmAndSSqrt, 2) * Ro; // числитель
      const denominator = 0.5 * sgm * (1 - Ro) + 2 * (S + 0.5 * sgm - sgmAndSSqrt) * Ro; // знаменатель

      const tmp = firstBraces + numerator / denominator;
      sInputsSum += tmp;
    }

    return (1 / S0) * sInputsSum;
  };
}

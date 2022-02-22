import React, { Component } from "react";
import { Box, Button, CardContent, Grid, Stack, TextField, Typography } from "@mui/material";

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
      <Box sx={{ flexGrow: 1, verticalAlign: "center", p: 4 }}>
        <Grid container spacing={2} maxWidth="lg">
          <CardContent sx={{ width: "100%" }}>
            <Typography variant="h3" color="text.secondary" gutterBottom sx={{ mb: 5 }}>
              Исходные данные
            </Typography>

            <TextField
              sx={{ maxWidth: "lg", mr: 2 }}
              label="Коэффициент A"
              helperText="Габаритная ширина оконного блока"
              id="A"
              type="number"
              defaultValue="0"
              size="small"
              value={this.state.A}
              onChange={(e) => this.setState({ A: Number(e.target.value) })}
              inputProps={{ step: "0.1" }}
            />

            <TextField
              sx={{ maxWidth: "lg", mr: 2 }}
              label="Коэффициент B"
              helperText="Габаритная высота оконного блока"
              id="B"
              type="number"
              defaultValue="0"
              size="small"
              value={this.state.B}
              onChange={(e) => this.setState({ B: Number(e.target.value) })}
              inputProps={{ step: "0.1" }}
            />

            <TextField
              sx={{ maxWidth: "lg" }}
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

            <br />
            <TextField
              sx={{ maxWidth: "lg", mt: 2 }}
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

            <Typography variant="h5" color="text.secondary" sx={{ mt: 4 }} gutterBottom>
              <strong>
                a<sub>i</sub>
              </strong>{" "}
              - габаритная ширина i-й ячейки в свету, м
            </Typography>

            <Typography variant="h5" color="text.secondary" gutterBottom>
              <strong>
                b<sub>i</sub>
              </strong>{" "}
              - габаритная высота i-й ячейки в свету, м
            </Typography>

            <Typography variant="h5" color="text.secondary" gutterBottom>
              <strong>
                σ<sub>i</sub>
              </strong>{" "}
              = 2d*(a<sub>i</sub> * b<sub>i</sub>)
            </Typography>

            <Typography variant="h5" color="text.secondary" gutterBottom>
              <strong>
                S<sub>i</sub>
              </strong>{" "}
              = a<sub>i</sub> * b<sub>i</sub>
            </Typography>

            <Box>
              <Stack direction="row" spacing={2} sx={{ pb: 1, pt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (this.state.sInputs.length > 2) {
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
                  <Box sx={{ pt: 3 }}>
                    <Grid container spacing={6} maxWidth="lg" justifyItems="start" key={indexIncremented} wrap="nowrap">
                      <Grid item xs={2}>
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
                      <Grid item xs={2}>
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
                      <Grid item xs={4}>
                        <Typography
                          variant="h5"
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
                      <Grid item xs={4}>
                        <Typography
                          variant="h5"
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
                  </Box>
                );
              })}
            </Box>
          </CardContent>

          <CardContent sx={{ width: "100%" }}>
            <Typography variant="h3" color="text.secondary" gutterBottom sx={{ mb: 5 }}>
              Расчет
            </Typography>

            <Typography
              variant="h5"
              color="text.secondary"
              gutterBottom
              sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
            >
              <strong>
                S<sub>0</sub>
              </strong>{" "}
              - площадь светового проема в снегу = <strong>A * B</strong> ={" "}
              {this._calculateSquare({ a: this.state.A, b: this.state.B })}м<sup>2</sup>
            </Typography>
            <br />
            <Typography
              variant="h5"
              color="text.secondary"
              gutterBottom
              sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
            >
              <strong>
                τ<sub>2</sub>
              </strong>{" "}
              - коэффициент, учитывающий потери света в переплетах ={" "}
              <strong>
                {Number.isFinite(tau2) ? tau2 : <span style={{ color: "#E53935" }}>Не все коэффициенты указаны</span>}
              </strong>
            </Typography>
          </CardContent>
        </Grid>
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

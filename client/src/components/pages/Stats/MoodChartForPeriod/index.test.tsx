import computeTrendlinePoints from "./computeTrendlinePoints";

describe("MoodChartForPeriod", () => {
  test("computeTrendlinePoints", () => {
    expect(
      computeTrendlinePoints(
        {
          allIds: ["2020-07-24T00:00:00.000Z", "2020-07-28T00:00:00.000Z"],
          byId: {
            "2020-07-24T00:00:00.000Z": { mood: 4 },
            "2020-07-28T00:00:00.000Z": { mood: 5 },
          },
        },

        [
          new Date("2020-07-25T00:00:00.000Z").getTime(),
          new Date("2020-07-27T00:00:00.000Z").getTime(),
        ]
      )
    ).toMatchInlineSnapshot(`
      [
        [
          1595635200000,
          4.25,
        ],
        [
          1595640600000,
          4.265625,
        ],
        [
          1595646000000,
          4.28125,
        ],
        [
          1595651400000,
          4.296875,
        ],
        [
          1595656800000,
          4.3125,
        ],
        [
          1595662200000,
          4.328125,
        ],
        [
          1595667600000,
          4.34375,
        ],
        [
          1595673000000,
          4.359375,
        ],
        [
          1595678400000,
          4.375,
        ],
        [
          1595683800000,
          4.390625,
        ],
        [
          1595689200000,
          4.40625,
        ],
        [
          1595694600000,
          4.421875,
        ],
        [
          1595700000000,
          4.4375,
        ],
        [
          1595705400000,
          4.453125,
        ],
        [
          1595710800000,
          4.46875,
        ],
        [
          1595716200000,
          4.484375,
        ],
        [
          1595721600000,
          4.5,
        ],
        [
          1595727000000,
          4.515625,
        ],
        [
          1595732400000,
          4.53125,
        ],
        [
          1595737800000,
          4.546875,
        ],
        [
          1595743200000,
          4.5625,
        ],
        [
          1595748600000,
          4.578125,
        ],
        [
          1595754000000,
          4.59375,
        ],
        [
          1595759400000,
          4.609375,
        ],
        [
          1595764800000,
          4.625,
        ],
        [
          1595770200000,
          4.640625,
        ],
        [
          1595775600000,
          4.65625,
        ],
        [
          1595781000000,
          4.671875,
        ],
        [
          1595786400000,
          4.6875,
        ],
        [
          1595791800000,
          4.703125,
        ],
        [
          1595797200000,
          4.71875,
        ],
        [
          1595802600000,
          4.734375,
        ],
        [
          1595808000000,
          4.75,
        ],
      ]
    `);
  });
});
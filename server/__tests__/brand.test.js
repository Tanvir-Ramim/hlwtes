// necessary modules
const axios = require("axios");

// Mocking the response data
const responseData = `
<style type="text/css">
    .tftable {font-size:14px;color:#333333;width:100%;border-width: 1px;border-color: #87ceeb;border-collapse: collapse;}
    .tftable th {font-size:18px;background-color:#87ceeb;border-width: 1px;padding: 8px;border-style: solid;border-color: #87ceeb;text-align:left;}
    .tftable tr {background-color:#ffffff;}
    .tftable td {font-size:14px;border-width: 1px;padding: 8px;border-style: solid;border-color: #87ceeb;}
    .tftable tr:hover {background-color:#e0ffff;}
</style>

<table class="tftable" border="1">
    <tr>
        <th>Name</th>
        <th>Education</th>
        <th>Role</th>
    </tr>
    <tr>
        <td>Mahmudul Hasan</td>
        <td>B.Sc. in Computer Science & Engineering (CSE)</td>
        <td>Backend Developer (Node JS)</td>
    </tr>
</table>
`;

// Mocking the axios response
jest.mock("axios");

// Jest test
test("API response status is 200", async () => {
  // Mocking axios response
  axios.get.mockResolvedValue({ status: 200, data: responseData });

  // Performing API request (not necessary for this mock)
  const response = await axios.get("API_ENDPOINT");

  // Validating response status
  expect(response.status).toBe(200);
});

// Jest test for visualizing response data
test("Visualize response data", async () => {
  // Mocking axios response
  axios.get.mockResolvedValue({ status: 200, data: responseData });



  // Extracting response data
  const responseText = responseData;

  // Constructing visualizer payload (not necessary for this mock)
  const constructVisualizerPayload = () => ({ response: responseText });

  expect(responseText.includes("Mahmudul Hasan")).toBe(true);
});

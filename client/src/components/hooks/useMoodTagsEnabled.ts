import { useSelector } from "react-redux";
import userSlice from "../../store/userSlice";

// User ids of users who have logged a mood that includes a description
// between 2023-11-18 and 2024-11-19 and within the last year
const ENABLED_USER_IDS = new Set([
  "041f0664-e2c2-4472-8c64-0a0d04e46dcf",
  "07d5a9d0-29cd-44cc-94be-a94019eafe86",
  "0afbb5c7-df87-476c-87fb-67a5ebef402f",
  "0ca8fe63-83c7-4c87-9d58-b78e0c98235d",
  "136a90ae-28e0-488e-951a-ca4637fcefd2",
  "13a5eb2a-07eb-40d6-9aca-7682f57380d8",
  "14f4527d-1f39-49ca-817a-71ac84cd2fff",
  "1772447b-a002-40d7-b437-ed21007acba3",
  "19b636c6-bbaa-4570-8ea4-e173c6d79957",
  "1e6986e9-8a36-4bd9-aa61-b5ec3750939a",
  "1f9d98af-7735-4d27-8eea-fc49a5a85554",
  "1fcc194e-ef7b-420f-ae7d-081cf6e83683",
  "1ff824fb-3bab-4f9b-a2e1-14b948f4fedb",
  "2870aa8b-58aa-4719-b14a-0ed2d96328b0",
  "29bbb1e4-78b0-481b-b100-e167fa134b59",
  "33fbdb2a-ef69-420f-a59b-811532090690",
  "35573b6f-2071-4d79-8a2c-c3df8e6e7620",
  "37d27acd-17b5-4749-83fe-33245b300c01",
  "3c41fb42-ceff-4885-847e-6abb8e898b1c",
  "3dbd84e1-97b5-4861-ab2d-437b46e5f653",
  "3fa1a3cf-8233-4b50-9889-adaa29b95b1a",
  "437ed39a-6158-4d25-80d6-758ffa78476b",
  "43cc294a-9515-4287-943a-37353ccfa316",
  "461425f3-7f85-48e3-94e6-37b276e408fc",
  "4926da0a-9132-417d-ba2e-fbfea33c903c",
  "562a3eac-b4e5-41c7-a307-66af4044b776",
  "5ca60ae5-0b0c-49d9-a138-685a52c04099",
  "622986d1-11df-404e-be7e-1f765b02c594",
  "62d57fb1-9c45-4a92-9edf-fb92da0705f8",
  "6cc24638-9266-44a8-ae4d-f40e92ba631a",
  "6db3d1d7-4b0f-45d5-af36-f57d6e13ef88",
  "7355f873-af2a-4e2d-b6ce-8ade5ae53f0d",
  "75b1efe9-3381-4e9c-bd05-20fdaf87bbb8",
  "785f0e4d-d52d-417d-89ca-5cb3478dc7a6",
  "79be2726-90fc-4e10-90c5-149010ada058",
  "7be9f496-cb47-4719-94cc-e6bf2637a556",
  "7e78eb52-13c9-459c-a133-0e47f84e0cd7",
  "7e866f1f-e0eb-4a8e-8b6c-f7e115b266b9",
  "7f175202-4fac-465e-a50e-6b6ad1f87ce8",
  "8044da18-eff4-40a0-977c-548d20463d48",
  "842e238e-dac4-455f-b724-df4f912b4b4a",
  "8b4f5fcf-75bb-4be1-af2d-38f96197d01a",
  "8cb6e16b-e9da-4fea-9bb0-c9151817a1b0",
  "8dd5a0ce-f982-43db-a845-c9a5ac9a4e4e",
  "92f17e67-1bd9-41ec-9e2f-6a5b266e4242",
  "99b4226a-30c8-49f0-973a-158394d07678",
  "99d9a0a2-e553-442c-a417-c9ac171aec11",
  "9b953ef5-6bf1-47fb-aac0-22b29096db19",
  "9c00f5c0-16fb-43ee-894b-56564cb17657",
  "9d243188-3a40-4d3d-8004-c77168394925",
  "9d3a4f25-06c8-4bb7-a088-a514a7865ec4",
  "9f56dd29-ca7f-4167-a698-35d01a6c90d9",
  "a2a5f22c-7323-4d34-b86b-36417f13e75f",
  "a6f553d3-977f-4f13-b141-b50d0df9cd46",
  "ac77dc8d-76f3-4113-b39a-21a5f51e30ea",
  "ad52d4ee-e272-4a2a-b677-371b1133d1d0",
  "b165006e-cf0c-4903-bd33-106445364a41",
  "b1e6254c-9569-4600-b9f9-9ca085624e40",
  "b23f4e93-b491-4b1d-a98b-37c1636d370a",
  "b3b0f519-6b07-41f4-89a7-1b614e92764b",
  "b51a3569-3e77-4159-9e9e-85315dac9d60",
  "c0c0e590-bc18-4735-abfb-b5a44accc5cd",
  "c4fedcc8-d1fa-4295-8106-429701339d70",
  "cb4f6e4d-53b6-441b-ba73-876db28e743f",
  "cdc571bf-e3b9-4dda-adf6-fc25d426170f",
  "cef5b291-9ada-4c10-bf66-a3d3bec5062a",
  "cf9ff549-4bd6-4583-a23a-072c6247e2dd",
  "cfc0d3ca-346c-4582-b99b-23497f217c32",
  "d219e723-bc15-4950-8446-8ec468246f69",
  "e45acfa8-2834-44e4-aa9c-7fa975d7843a",
  "e5635efd-9a99-41a2-a576-b6f5f69ccfbe",
  "e584c34a-24fe-4a4f-9080-a86a15d1f8f5",
  "edee1970-f292-44d3-a038-ddb75d7af3fe",
  "f10799c4-d7cd-45ed-be61-41a39f5eec06",
  "f36b9e7d-4d76-4e82-9108-99b17becf37d",
  "f92e1231-9557-47d8-a9a3-5a75adf299f8",
]);

export function useMoodTagsEnabled(): boolean {
  const userId = useSelector(userSlice.selectors.id);
  return Boolean(userId && ENABLED_USER_IDS.has(userId));
}
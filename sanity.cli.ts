import { defineCliConfig } from "sanity/cli";
import { requireSanityEnvironment } from "./sanity/env";

const { projectId, dataset } = requireSanityEnvironment();

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
});

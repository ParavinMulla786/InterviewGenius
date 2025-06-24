/** @type { import("drizzle-kit").Config } */
export default {
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./utils/schema.js",
  dbCredentials:{
    url:'postgresql://neondb_owner:npg_ikMht85gAclI@ep-black-feather-a8kzqurq-pooler.eastus2.azure.neon.tech/MockInterviewer?sslmode=require'
  }
};

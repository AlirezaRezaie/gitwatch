import axios from "axios";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "..", "/.env") });
const requestEndPoint = process.env.ENDPOINT as string;
const github_token = process.env.TOKEN as string;

export class Detector {
  all_commits: number = 0;
  endpoint: string;
  githubToken: string;
  constructor(endpoint: string, githubToken: string) {
    this.endpoint = endpoint;
    this.githubToken = githubToken;
  }

  async watchNewCommit(callback: any) {
    return await new Promise(() => {
      setInterval(() => {
        axios
          .get(this.endpoint, {
            headers: {
              Authorization: this.githubToken,
            },
          })
          .then((repo: any) => {
            if (repo.data.length > this.all_commits) {
              this.all_commits = repo.data.length;
              callback(
                repo.data[0].commit.author.name,
                repo.data[0].commit.message
              );
            }
          })
          .catch((err: any) => {
            console.log(err.message);
          });
      }, 1000);
    });
  }
}

let gitwatchClient = new Detector(requestEndPoint, github_token);

gitwatchClient.watchNewCommit((author: string, message: string) => {
  console.log(`${author} commited ${message}`);
});

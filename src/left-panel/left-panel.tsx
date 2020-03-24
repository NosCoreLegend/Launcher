import React, { Fragment } from "react";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import styles from "./left-panel.less";
import { AuthInformation } from "../auth/auth-client";
import Store from "electron-store";

const nosDirectory = "C:\\Program Files (x86)\\NosTale\\";

export class LeftPanel extends React.Component<AuthInformation, {}> {
  startNostale = () => {
    if (this.props.user === "") {
      return;
    }

    const store = new Store();
    const configuration = store.get("user-configuration");
    const executablePath = `${configuration?.client.substring(
      0,
      configuration?.client.lastIndexOf("\\") + 1
    ) ?? nosDirectory}NosCore.exe`;
    const fs = require("fs");

    const parameters = ["gf"];
    const ip = "127.0.0.1";
    const port = 4002;

    fs.readFile(
      configuration?.client ?? `${nosDirectory}NostaleClientX.exe`,
      "binary",
      function(err: any, data: any) {
        if (err) {
          return console.log(err);
        }
        let result = data;

        // change port
        const portRegexp = new RegExp(
          `${String.fromCharCode(0)}[${String.fromCharCode(
            160
          )}-${String.fromCharCode(169)}]${String.fromCharCode(
            15
          )}${String.fromCharCode(0)}`,
          "g"
        );
        result = result.replace(
          portRegexp,
          String.fromCharCode(0) +
            String.fromCharCode(Number("0x" + port.toString(16).substr(1, 2))) +
            String.fromCharCode(
              Number("0x0" + port.toString(16).substr(0, 1))
            ) +
            String.fromCharCode(0)
        );

        // change ip
        const endOfIp =
          String.fromCharCode(0) + String.fromCharCode(255).repeat(4);
        const reg = /\d{2,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;
        let ipToReplace;

        // tslint:disable-next-line: no-conditional-assignment
        while ((ipToReplace = reg.exec(result)) !== null) {
          const lengthDiff = 15 - ipToReplace.toString().length;
          const re = new RegExp(
            ipToReplace.toString() +
              String.fromCharCode(0).repeat(lengthDiff) +
              endOfIp +
              ".",
            "g"
          );
          result = result
            .toString()
            .replace(
              re,
              ip +
                String.fromCharCode(0).repeat(15 - ip.length) +
                String.fromCharCode(0) +
                String.fromCharCode(255).repeat(4) +
                String.fromCharCode(ip.length)
            );
        }
        fs.writeFile(executablePath, result, "binary", function(err: any) {
          if (err) {
            return console.log(err);
          }
          console.log(`${executablePath} generated!`);
          fs.copyFile(
            configuration?.apidll,
            (configuration?.client.substring(
              0,
              configuration?.client.lastIndexOf("\\") + 1
            ) ?? nosDirectory) + "gameforge_client_api.dll",
            function(err: any) {
              if (err) {
                return console.log(err);
              }
              console.log('gameforge_client_api.dll copied!');
              require("child_process").execFile(executablePath, parameters);
            }
          );
        });
      }
    );
  };

  render() {
    const store = new Store();
    return (
      <div className={styles.leftPanel}>
        <h1>{store.get("configuration").Title}</h1>
        <p>{store.get("configuration").Description}</p>
        <nav className={styles.leftNavBar}>
          <ul>
            {Object.keys(store.get("configuration").Links).map(
              (index: string) => (
                <li key={index}>
                  <a href={store.get("configuration").Links[index]}>{index}</a>
                </li>
              )
            )}
          </ul>
        </nav>
        <Button
          onClick={this.startNostale}
          className={`${styles.playButton} btn-lg`}
          variant="primary"
          disabled={this.props.user === ""}
        >
          PLAY
        </Button>
        {/* <ProgressBar className="progressBar" now={20} label={`20%`} /> */}
      </div>
    );
  }
}

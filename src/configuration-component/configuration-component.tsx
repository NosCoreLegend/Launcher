import { FaUserCircle, FaCog } from "react-icons/fa";
import React, { Fragment } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import styles from "./configuration-component.less";
import { AuthInformation, AuthClient } from "../auth/auth-client";
import { JSonRpcResult, JSonRpcMessage } from "../rpc/rpc-messages";
import { ClientLibrary } from "../rpc/client-library";
import Store from "electron-store";

interface ConfigurationComponentState {
  showMenu: boolean;
  error: string;
  client: string | undefined;
  apidll: string | undefined;
}

export interface ConfigurationComponentProps {}

export class ConfigurationComponent extends React.Component<
  {},
  ConfigurationComponentState
> {
  server: any;

  constructor(
    props: ConfigurationComponentState,
    state: ConfigurationComponentState
  ) {
    super(props, state);

    this.state = {
      showMenu: false,
      error: "",
      apidll: undefined,
      client: undefined
    };

    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  componentDidMount() {
    const store = new Store();
    const configuration = store.get("user-configuration");

    this.setState({
      client: configuration?.client ?? undefined,
      apidll: configuration?.apidll ?? undefined,
      error: "",
      showMenu: this.state.showMenu
    });
  }

  configurationForm = (event: any) => {
    event.preventDefault();
    const client = (document.getElementById("clientpath") as HTMLInputElement)
      .files;
    const apidll = (document.getElementById("dllpath") as HTMLInputElement)
      .files;
    const store = new Store();
    if (client && apidll) {
      store.set("user-configuration", {
        client: client[0]?.path,
        apidll: apidll[0]?.path
      });
      this.setState({
        showMenu: !this.state.showMenu,
        error: "",
        client: client[0]?.path,
        apidll: apidll[0]?.path
      });
    }
  };

  showMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    this.setState({
      showMenu: !this.state.showMenu,
      error: "",
      client: this.state.client,
      apidll: this.state.apidll
    });
  };

  closeMenu = () => {
    this.setState({
      showMenu: false,
      error: "",
      client: this.state.client,
      apidll: this.state.apidll
    });
  };

  render() {
    return (
      <Fragment>
        <FaCog onClick={this.showMenu} />
        <Modal
          className={styles.configurationMenu}
          show={this.state.showMenu}
          centered
          onHide={this.closeMenu}
        >
          <Modal.Header closeButton>
            <Modal.Title>Configuration</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.configurationForm}>
              {this.state.error !== "" && (
                <div className="alert alert-danger">{this.state.error}</div>
              )}
              <Form.Group>
              <Form.Label>NostaleClientX.exe path</Form.Label>
              <p className={styles.label}>{this.state.client}</p>
                <Form.Control
                  id="clientpath"
                  type="file"
                  accept=".exe"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>gameforge_client_api.dll path</Form.Label>
                <p className={styles.label}>{this.state.apidll}</p>
                <Form.Control
                  id="dllpath"
                  type="file"
                  accept="gameforge_client_api.dll"
                />
              </Form.Group>

              <Button
                variant="primary"
                className={styles.configureButton}
                type="submit"
              >
                Save config
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Fragment>
    );
  }
}

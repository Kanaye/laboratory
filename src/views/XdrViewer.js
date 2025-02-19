import React from "react";
import { connect } from "react-redux";
import { xdr } from "stellar-sdk";
import debounce from "lodash/debounce";
import functions from "lodash/functions";
import indexOf from "lodash/indexOf";
import FETCHED_SIGNERS from "constants/fetched_signers";
import SelectPicker from "components/FormComponents/SelectPicker";
import extrapolateFromXdr from "helpers/extrapolateFromXdr";
import TreeView from "components/TreeView";
import validateBase64 from "helpers/validateBase64";
import {
  updateXdrInput,
  updateXdrType,
  fetchLatestTx,
  fetchSigners,
} from "actions/xdrViewer";
import { addEventHandler, logEvent } from "helpers/metrics";
import xdrViewerMetrics, { metricsEvents } from "metricsHandlers/xdrViewer";

// XDR decoding doesn't happen in redux, but is pretty much the only thing on
// this page that we care about. Log metrics from the component as well.
addEventHandler(xdrViewerMetrics);

const tLogEvent = debounce(logEvent, 1000);

function XdrViewer(props) {
  let { dispatch, state, baseURL, networkPassphrase } = props;

  let validation = validateBase64(state.input);
  let messageClass =
    validation.result === "error"
      ? "xdrInput__message__alert"
      : "xdrInput__message__success";
  let message = <p className={messageClass}>{validation.message}</p>;

  let xdrTypeIsValid = indexOf(xdrTypes, state.type) >= 0;
  let treeView, errorMessage;
  if (state.input === "") {
    errorMessage = <p>Enter a base-64 encoded XDR blob to decode.</p>;
  } else if (!xdrTypeIsValid) {
    errorMessage = <p>Please select a XDR type</p>;
  } else {
    try {
      treeView = (
        <TreeView
          nodes={extrapolateFromXdr(state.input, state.type)}
          fetchedSigners={state.fetchedSigners}
        />
      );
      tLogEvent(metricsEvents.decodeSuccess, { type: state.type });
    } catch (e) {
      console.error(e);
      tLogEvent(metricsEvents.decodeFailed, { type: state.type });
      errorMessage = <p>Unable to decode input as {state.type}</p>;
    }
  }

  // Fetch signers on initial load
  if (
    state.input !== "" &&
    state.type === "TransactionEnvelope" &&
    state.fetchedSigners.state === FETCHED_SIGNERS.NONE
  ) {
    dispatch(fetchSigners(state.input, baseURL, networkPassphrase));
  }

  return (
    <div>
      <div className="XdrViewer__setup so-back">
        <div className="so-chunk">
          <div className="pageIntro">
            <p>
              <a href="https://developers.stellar.org/docs/glossary/xdr/">
                External Data Representation (XDR)
              </a>{" "}
              is a standardized protocol that the Stellar network uses to encode
              data.
            </p>
            <p>
              The XDR Viewer is a tool that displays contents of a Stellar XDR
              blob in a human readable format.
            </p>
          </div>
          <p className="XdrViewer__label">
            Input a base-64 encoded XDR blob, or{" "}
            <a
              onClick={() =>
                dispatch(fetchLatestTx(baseURL, networkPassphrase))
              }
            >
              fetch the latest transaction to try it out
            </a>
            :
          </p>
          <div className="xdrInput__input">
            <textarea
              value={state.input}
              className="xdrInput__input__textarea"
              onChange={(event) => {
                dispatch(updateXdrInput(event.target.value));
                if (state.type === "TransactionEnvelope") {
                  dispatch(
                    fetchSigners(
                      event.target.value,
                      baseURL,
                      networkPassphrase,
                    ),
                  );
                }
              }}
              placeholder="Example: AAAAAGXNhB2hIkbP//jgzn4os/AAAAZAB+BaLPAAA5Q/xL..."
            ></textarea>
          </div>
          <div className="xdrInput__message">{message}</div>

          <p className="XdrViewer__label">XDR type:</p>
          <SelectPicker
            value={state.type}
            placeholder="Select XDR type"
            onUpdate={(input) => dispatch(updateXdrType(input))}
            items={xdrTypes}
          />
        </div>
      </div>
      <div className="XdrViewer__results so-back">
        <div className="so-chunk">
          {errorMessage}
          {treeView}
        </div>
      </div>
    </div>
  );
}

export default connect(chooseState)(XdrViewer);
function chooseState(state) {
  return {
    state: state.xdrViewer,
    baseURL: state.network.current.horizonURL,
    networkPassphrase: state.network.current.networkPassphrase,
  };
}

// Array of all the xdr types. Then, the most common ones appear at the top
// again for convenience
let xdrTypes = functions(xdr).sort();
xdrTypes = [
  "TransactionEnvelope",
  "TransactionResult",
  "TransactionMeta",
  "---",
].concat(xdrTypes);

import * as React from 'react';
import {
  VersionProvider,
  useVersion,
  UpdateBanner,
  UpdatePrompt,
} from 'react-zero-downtime-build';
import './index.css';

function DemoContent() {
  const { updateAvailable, reload, hardReload, checkNow, current, latest } = useVersion();
  const [showPrompt, setShowPrompt] = React.useState(false);

  React.useEffect(() => {
    if (updateAvailable) {
      setShowPrompt(true);
    }
  }, [updateAvailable]);

  return (
    <div className="container">
      <UpdateBanner
        show={updateAvailable}
        onRefresh={reload}
        onHardRefresh={hardReload}
        position="top"
        message="A new build is available. Refresh to stay updated."
      />

      <UpdatePrompt
        show={showPrompt}
        onRefresh={reload}
        onHardRefresh={hardReload}
        onDismiss={() => setShowPrompt(false)}
        message="A new version is ready. Reload to apply updates."
      />

      <header>
        <h1>React Zero Downtime Build Demo</h1>
        <p>Simulate zero-downtime updates with version checks every 30s.</p>
      </header>

      <section className="panel">
        <h2>Version Info</h2>
        <div className="versions">
          <div>
            <h3>Current</h3>
            <p>Version: {current?.version ?? 'N/A'}</p>
            <p>Build ID: {current?.buildId ?? 'N/A'}</p>
          </div>
          <div>
            <h3>Latest</h3>
            <p>Version: {latest?.version ?? 'Unknown'}</p>
            <p>Build ID: {latest?.buildId ?? 'Unknown'}</p>
          </div>
        </div>
      </section>

      <section className="actions">
        <button onClick={checkNow}>Check for updates now</button>
        <button onClick={reload}>Refresh</button>
        <button onClick={hardReload}>Hard Refresh</button>
      </section>

      <section className="note">
        <p>
          To see the banner, deploy a new build so that <code>app-version.json</code>
          reflects a different version/build ID.
        </p>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <VersionProvider intervalMs={5000}>
      <DemoContent />
    </VersionProvider>
  );
}

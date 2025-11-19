import React from 'react';
import ReactDOM from 'react-dom/client';
import Portfolio from './Portfolio.jsx';
import EnvDiagnostics from './EnvDiagnostics.jsx';

const App = () => {
	const isDiag = new URLSearchParams(window.location.search).get('diag') === '1';
	return isDiag ? <EnvDiagnostics /> : <Portfolio />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
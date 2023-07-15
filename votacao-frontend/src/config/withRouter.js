import { useLocation, useNavigate, useParams } from "react-router-dom";

/**
 *Substitui a antiga withRouter do react-router-dom
 * @param {*} Component
 * @return {*} Component
 */
function withRouter(Component) {
	/**
	 * Componente com as propriedades do react-router-dom
	 * @param {*} props
	 * @return {*}
	 */
	function ComponentWithRouterProp(props) {
		const location = useLocation();
		const navigate = useNavigate();
		const params = useParams();
		return <Component {...props} router={{ location, navigate, params }} />;
	}

	return ComponentWithRouterProp;
}

export { withRouter };

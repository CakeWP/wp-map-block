import { Component } from "@wordpress/element";
import { withInstanceId } from "@wordpress/compose";
import { __ } from "@wordpress/i18n";
import Settings from "./settings";
import MapRender from "./render";

class edit extends Component {
	constructor(props) {
		super(props);
		// Assigning block_id in the attribute.
		this.props.setAttributes({
			map_id: "wpmapblock_" + this.props.clientId.substr(0, 8),
		});
	}
	render() {
		const { setAttributes, attributes } = this.props;
		return (
			<React.Fragment>
				<MapRender attributes={attributes} setAttributes={setAttributes} />
				<Settings attributes={attributes} setAttributes={setAttributes} />
			</React.Fragment>
		);
	}
}

export default withInstanceId(edit);

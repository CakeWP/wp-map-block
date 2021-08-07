<?php
namespace WPMapBlock;

class Block
{
    public static function init()
    {
        $self = new self();
        add_action('init', [$self, 'register_block']);
    }
    
    public function register_block()
    {
        register_block_type(
            'wpmapblock/wp-map-block',
            array(
                // Enqueue blocks.style.build.css on both frontend & backend.
                'style'         => 'wp-map-block-stylesheets',
                // Enqueue blocks.build.js in the editor only.
                'editor_script' => 'wp-map-block-js',
                // Enqueue Frontend scripts
                'script'          => 'wp-map-block-frontend-js',
                // Enqueue blocks.editor.build.css in the editor only.
                'editor_style'  => 'wp-map-block-editor-css',
                'render_callback' => [$this, 'render_callback'],
            )
        );
    }
    public function render_callback($attributes, $content = '')
    {
        $settings = [
            'map_marker' => isset($attributes['map_marker_list']) ? $attributes['map_marker_list'] : [[
                'lat' 		=> 23.7806365,
                'lng' 		=> 90.4193257,
                'title'		=> 'Bangladesh',
                'content'	=> 'A Beautiful Country'
            ]],
            'map_zoom' => (isset($attributes['map_zoom']) ? $attributes['map_zoom'] : 10),
            'scroll_wheel_zoom' => (isset($attributes['scroll_wheel_zoom']) ? $attributes['scroll_wheel_zoom'] : false),
            'map_type' => (isset($attributes['map_type']) ? $attributes['map_type'] : 'GM'),
        ];

        $map_width = (isset($attributes['map_width']) ? $attributes['map_width'] . '%' : '100%');
        $map_height = (isset($attributes['map_height']) ? $attributes['map_height'] . 'px' : '500px');
        $style = "
			width: {$map_width};
			height: {$map_height};
		";

        ob_start(); ?>
		<div id="<?php echo(isset($attributes['map_id']) ? $attributes['map_id'] : ''); ?>" data-settings='<?php echo json_encode($settings); ?>' class="wpmapblockrender" style="<?php echo $style; ?>"></div>
        <?php
        $output = ob_get_clean();
        return $output;
    }
}

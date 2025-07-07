# Post Buttons (Working Title)

> The easiest way to add custom marks in Kirby 4 Writer fields

The buttons plugin lets you add custom marks to any `Writer` fields by simply adding a few options to your `config/config.php`.

## Adding Marks

```config/config.php
return [
  "debug" => true,
  "post.buttons" => [
    "marks" => [
      "highlight" => [
        "icon" => "sparkling",
        "label" => "Amazingly Highlighted Text",
        "tag" => "mark",
        "class" => "super-highlight",
        "style" => "text-decoration: underline",
        "attrs" => [
          "x-data" => "highlight()",
          "x-click.prevent" => "alert(message)",
        ],
      ],
    ],
  ],
]
```

### Tags and Attributes:

The above code will add a "highlight" mark to the text that is rendered inside of a `<mark>`-tag in both, the writer field and the actual frontend-code of the page. The tag will feature all attributes added to the `attrs` array in both writer field and the actual rendered frontend.

### Styling

The `style` argument allows you to pass inline css to the mark that will be rendered **in the writer field only**. Frontend styling should be done via the actual classes. (Note: _Technically_ you _could_ add the `style` argument as another value on `attrs` to get it to show up in the frontend but that's generally not a smart idea).

### Label and Icon

The `label` and `icon` arguments set the label and icon for the button in the writer field. They do not show up in the rendered frontend. The icon can be any named icon from [Kirby's own iconset](https://getkirby.com/docs/reference/panel/icons)

## Using Marks

You will have to add your custom mark to the blueprint of your Writer field's in order to be able to use them.

**Example:**

```
text:
type: writer
marks:
  - bold
  - italic
  - strike
  - highlight
  - buttonLink
```

## Links

Links are special kinds of marks that allow you to add editable `<a href="...">`-tags with custom classes and attributes to your Writer fields.

You can add them like so:

```config/config.php
return [
  'post.buttons' => [
    "links" => [
      "buttonLink" => [
        "label" => "Special Link Button",
        "icon" => "attachment",
        "tag" => "button",
        "class" => "superspecial",
        "style" => "text-decoration: line-through",
        "attrs" => [
          "x-data" => "awesomeHighlight()",
        ],
      ],
    ],
  ]
];
```

The attributes and settings of links function exactly like those of regular marks. The only difference is in how they behave in the editor.

### Avoiding issues with links:

**Link fields have to have a class set on them. Otherwise the writer field will confuse them for regular links**

## Todo

These tasks still need to be completed before a public release;

- [] Report docs being broken to Kirby
- [] Report event-propagation bug to Kirby
- [] Report issue with inlining JS into the panel to Kirby
- [] Add comments
- [] Touch up ReadMe
- [] **Find a better name**

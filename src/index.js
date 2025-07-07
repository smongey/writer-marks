const marks = {};

for (const [name, schema] of Object.entries(window.smongey.writermarks.marks ?? {})) {
  marks[name] = {
    get button() {
      return {
        icon: schema.icon ?? "bolt",
        label: schema.label,
      };
    },

    commands() {
      return () => this.toggle();
    },

    get name() {
      return name;
    },

    get schema() {
      return {
        parseDOM: [{ tag: schema.tag, class: schema.class }],
        toDOM: () => [
          schema.tag,
          { class: schema.class, style: schema.style ?? "", ...schema.attrs },
          0,
        ],
      };
    },
  };
}
for (const [name, schema] of Object.entries(window.smongey.writermarks.links ?? {})) {
  marks[name] = {
    get button() {
      return {
        icon: schema.icon,
        label: schema.label,
      };
    },

    commands() {
      const commands = {};
      commands[name] = (event) => {
        if (event.altKey || event.metaKey) {
          return this.remove();
        }

        window.panel.dialog.open({
          component: "k-link-dialog",
          props: {
            value: this.editor.getMarkAttrs(name),
          },
          on: {
            cancel: () => this.editor.focus(),
            submit: (values) => {
              window.panel.dialog.close();
              this.editor.command("toggle" + name, values);
            },
          },
        });
      };
      commands["insert" + name] = (attrs = {}) => {
        const { selection } = this.editor.state;

        // if no text is selected and link mark is not active
        // we insert the link as text
        if (
          selection.empty &&
          this.editor.activeMarks.includes(name) === false
        ) {
          this.editor.insertText(attrs.href, true);
        }

        if (attrs.href) {
          return this.update(attrs);
        }
      };
      commands["toggle" + name] = (attrs = {}) => {
        if (attrs.href?.length > 0) {
          this.editor.command("insert" + name, attrs);
        } else {
          this.editor.command("remove" + name);
        }
      };
      commands["remove" + name] = () => {
        return this.remove();
      };
      return commands;
    },

    get defaults() {
      return {
        target: null,
      };
    },

    get name() {
      return name;
    },

    plugins() {
      return [
        {
          props: {
            handleClick: (view, pos, event) => {
              const attrs = this.editor.getMarkAttrs(name);

              if (attrs.href && event.altKey === true) {
                event.stopPropagation();
                window.open(attrs.href, attrs.target);
              }
            },
          },
        },
      ];
    },

    get schema() {
      return {
        attrs: {
          href: {
            default: null,
          },
          target: {
            default: null,
          },
          title: {
            default: null,
          },
        },
        inclusive: false,
        parseDOM: [
          {
            tag: "a[href]:not([href^='mailto:'])",
            class: schema.class,
            getAttrs: (dom) => ({
              href: dom.getAttribute("href"),
              target: dom.getAttribute("target"),
              title: dom.getAttribute("title"),
            }),
          },
        ],
        toDOM: (node) => [
          "a",
          {
            class: schema.class,
            style: schema.style,
            ...node.attrs,
            ...schema.attrs,
          },
          0,
        ],
      };
    },
  };
}

window.panel.plugin("smongey/writer-marks", {
  writerMarks: marks,
});

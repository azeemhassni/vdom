import {zip} from "./utils";

export function h(tagName, attributes = {}, ...children) {
    return {
        tagName,
        attributes,
        children: [].concat.apply([], children)
    }
}

export function render(node = {}) {

    if(typeof node === 'number' || typeof node === 'undefined') {
        return document.createTextNode(node.toString());
    }

    if (typeof node === 'string') {
        return document.createTextNode(node);
    }

    const children = node.children || [];
    const attributes = node.attributes || {};
    const {tagName} = node;

    const el = document.createElement(tagName);

    for (let [attribute, value] of Object.entries(attributes)) {
        if (attribute === 'className') {
            attribute = 'class';
        }

        el.setAttribute(attribute, value);
    }
    children.map(render).forEach(el.appendChild.bind(el));
    return el;
}

export function mount(app, target) {
    target.replaceWith(app);
    return app;
}

function diffChildren(old, updated) {
    if(typeof old === "undefined" && typeof updated === "undefined") {
        return _ => {};
    }

    const patches = [];

    for (const [oldChild, newChild] of zip(old, updated)) {
        patches.push(diff(oldChild, newChild));
    }

    const extraPatches = [];

    for (const child of updated.slice(old.length)) {
        extraPatches.push(el => {
            el.appendChild(render(child));
            return el;
        })
    }

    return el => {
        zip(patches, el.childNodes).forEach(([patch, child]) => {
            patch(child);
        });

        extraPatches.forEach(patch => patch(el));

        return el;
    };
}

function diffAttributes(old, updated) {
    if(!old && !updated) {
        return _ => {};
    }

    // console.log(old, updated);
    const patches = [];

    Object
        .keys(old)
        .forEach(attribute => {
            if(old[attribute] && old[attribute] === updated[attribute]) {
                return;
            }

            patches.push(el => {
                el.removeAttribute(attribute);
                return el;
            })
        });

    Object
        .entries(updated)
        .forEach(([attribute, value]) => {

            if(old[attribute] && old[attribute] === value) {
                return;
            }

            patches.push(el => {
                el.setAttribute(attribute, value);
                return el;
            })
        });

    return el => {
        patches.forEach(patch => patch(el));
    }

}


export function diff(old, updated) {

    if(typeof updated === "undefined") {
        return el => {
            el.remove();
            return undefined;
        }
    }

    if (old.tagName !== updated.tagName) {
        return el => {
            const updatedRoot = render(updated);
            el.replaceWith(updatedRoot);
            return updatedRoot;
        }
    }

    if (typeof old === 'string' || typeof updated === 'string') {

        if (old !== updated) {
            return el => {
                const updatedRoot = render(updated);
                el.replaceWith(updatedRoot);
                return updatedRoot;
            }
        }

    }

    const patchChildren = diffChildren(old.children, updated.children);
    const patchAttributes = diffAttributes(old.attributes, updated.attributes);

    return el => {
        patchChildren(el);
        patchAttributes(el);

        return el;
    };
}
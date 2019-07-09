import { UITheme } from "typescene";

// set primary theme color
UITheme.current.addColor("primary", "#5cb85c");

// dark mode! -- uncomment below:
// UITheme.current.addColor("primary", "@slate");
// UITheme.current.addColor("background", "#333");

// set base font styles:
UITheme.current.baseControlStyle = UITheme.current.baseControlStyle.extend({
    textStyle: {
        fontFamily: "source sans pro,sans-serif",
        fontSize: 16
    }
})
UITheme.current.styles["heading1"] = UITheme.current.styles["heading1"].extend({
    textStyle: {
        fontFamily: "titillium web,sans-serif"
    }
})

// add icons (for a real app these can be loaded using e.g. webpack)
// NOTE: these icons are taken from Google Material Design icon library:
UITheme.current.addIcon("add", "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"\><path d=\"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z\"/><path d=\"M0 0h24v24H0z\" fill=\"none\"/></svg>");
UITheme.current.addIcon("delete", "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z\"/><path d=\"M0 0h24v24H0z\" fill=\"none\"/></svg>");

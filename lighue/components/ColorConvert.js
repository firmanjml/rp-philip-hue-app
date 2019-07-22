import { fromHsv } from 'react-native-color-picker'

export const ColorConversionToXY = (color) => {
    var hexcolor = fromHsv({ h: color.h, s: color.s, v: color.v })
    var colourHex = hexcolor;
    var colourR = parseInt(colourHex.slice(1, 3), 16);
    var colourG = parseInt(colourHex.slice(3, 5), 16);
    var colourB = parseInt(colourHex.slice(5), 16);
    var red = colourR;
    var green = colourG;
    var blue = colourB;
    //Apply a gamma correction to the RGB values, which makes the color more vivid and more the like the color displayed on the screen of your device
    red = (red > 0.04045) ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4) : (red / 12.92);
    green = (green > 0.04045) ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92);
    blue = (blue > 0.04045) ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4) : (blue / 12.92);
    //RGB values to XYZ using the Wide RGB D65 conversion formula
    // var X = red * 0.664511 + green * 0.154324 + blue * 0.162028;
    // var Y = red * 0.283881 + green * 0.668433 + blue * 0.047685;
    // var Z = red * 0.000088 + green * 0.072310 + blue * 0.986039;
    var X = red * 0.649926 + green * 0.103455 + blue * 0.197109;
    var Y = red * 0.234327 + green * 0.743075 + blue * 0.022598;
    var Z = red * 0.0000000 + green * 0.053077 + blue * 1.035763;
    //Calculate the xy values from the XYZ values
    var x = (X / (X + Y + Z)).toFixed(4);
    var y = (Y / (X + Y + Z)).toFixed(4);
    if (isNaN(x)) {
        x = 0;
    }
    if (isNaN(y)) {
        y = 0;
    }
    return [parseFloat(x),parseFloat(y)]
}

export const ConvertXYtoHex = (x, y, bri) => {
    z = 1.0 - x - y;

    Y = bri / 255.0; // Brightness of lamp
    X = (Y / y) * x;
    Z = (Y / y) * z;

    r = X * 1.612 - Y * 0.203 - Z * 0.302;
    g = -X * 0.509 + Y * 1.412 + Z * 0.066;
    b = X * 0.026 - Y * 0.072 + Z * 0.962;

    r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
    g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
    b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;

    maxValue = Math.max(r, g, b);
    r /= maxValue;
    g /= maxValue;
    b /= maxValue;

    r = r * 255; if (r < 0) { r = 255 };
    g = g * 255; if (g < 0) { g = 255 };
    b = b * 255; if (b < 0) { b = 255 };

    r = Math.round(r).toString(16);
    g = Math.round(g).toString(16);
    b = Math.round(b).toString(16);

    if (r.length < 2)
        r = "0" + r;
    if (g.length < 2)
        g = "0" + g;
    if (b.length < 2)
        b = "0" + r;
    rgb = "#" + r + g + b;

    return rgb;
}




import { fromHsv } from 'react-native-color-picker'

export const ColorConversionToXY = (color) => {
    var hexcolor = fromHsv({ h: color.h, s: color.s, v: color.v })
    var colourHex = hexcolor;

    var colourR = parseInt(colourHex.slice(1, 3), 16);
    var colourG = parseInt(colourHex.slice(3, 5), 16);
    var colourB = parseInt(colourHex.slice(5), 16);

    // console.log("HEX " + colourHex);
    // console.log("RGB " + colourR.toString() + "," + colourG.toString() + "," + colourB.toString());

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
    // console.log("X " + x);
    // console.log("Y " + y);

    // return {x,y}
    
    return [parseFloat(x),parseFloat(y)]
}




// File:src/Three.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

var THREE = { REVISION: '69' };

// browserify support

if ( typeof module === 'object' ) {

	module.exports = THREE;

}

// polyfills

if ( Math.sign === undefined ) {

	Math.sign = function ( x ) {

		return ( x < 0 ) ? - 1 : ( x > 0 ) ? 1 : 0;

	};

}

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent.button

THREE.MOUSE = { LEFT: 0, MIDDLE: 1, RIGHT: 2 };

// GL STATE CONSTANTS

THREE.CullFaceNone = 0;
THREE.CullFaceBack = 1;
THREE.CullFaceFront = 2;
THREE.CullFaceFrontBack = 3;

THREE.FrontFaceDirectionCW = 0;
THREE.FrontFaceDirectionCCW = 1;

// SHADOWING TYPES

THREE.BasicShadowMap = 0;
THREE.PCFShadowMap = 1;
THREE.PCFSoftShadowMap = 2;

// MATERIAL CONSTANTS

// side

THREE.FrontSide = 0;
THREE.BackSide = 1;
THREE.DoubleSide = 2;

// shading

THREE.NoShading = 0;
THREE.FlatShading = 1;
THREE.SmoothShading = 2;

// colors

THREE.NoColors = 0;
THREE.FaceColors = 1;
THREE.VertexColors = 2;

// blending modes

THREE.NoBlending = 0;
THREE.NormalBlending = 1;
THREE.AdditiveBlending = 2;
THREE.SubtractiveBlending = 3;
THREE.MultiplyBlending = 4;
THREE.CustomBlending = 5;

// custom blending equations
// (numbers start from 100 not to clash with other
//  mappings to OpenGL constants defined in Texture.js)

THREE.AddEquation = 100;
THREE.SubtractEquation = 101;
THREE.ReverseSubtractEquation = 102;
THREE.MinEquation = 103;
THREE.MaxEquation = 104;

// custom blending destination factors

THREE.ZeroFactor = 200;
THREE.OneFactor = 201;
THREE.SrcColorFactor = 202;
THREE.OneMinusSrcColorFactor = 203;
THREE.SrcAlphaFactor = 204;
THREE.OneMinusSrcAlphaFactor = 205;
THREE.DstAlphaFactor = 206;
THREE.OneMinusDstAlphaFactor = 207;

// custom blending source factors

//THREE.ZeroFactor = 200;
//THREE.OneFactor = 201;
//THREE.SrcAlphaFactor = 204;
//THREE.OneMinusSrcAlphaFactor = 205;
//THREE.DstAlphaFactor = 206;
//THREE.OneMinusDstAlphaFactor = 207;
THREE.DstColorFactor = 208;
THREE.OneMinusDstColorFactor = 209;
THREE.SrcAlphaSaturateFactor = 210;


// TEXTURE CONSTANTS

THREE.MultiplyOperation = 0;
THREE.MixOperation = 1;
THREE.AddOperation = 2;

// Mapping modes

THREE.UVMapping = function () {};

THREE.CubeReflectionMapping = function () {};
THREE.CubeRefractionMapping = function () {};

THREE.SphericalReflectionMapping = function () {};
THREE.SphericalRefractionMapping = function () {};

// Wrapping modes

THREE.RepeatWrapping = 1000;
THREE.ClampToEdgeWrapping = 1001;
THREE.MirroredRepeatWrapping = 1002;

// Filters

THREE.NearestFilter = 1003;
THREE.NearestMipMapNearestFilter = 1004;
THREE.NearestMipMapLinearFilter = 1005;
THREE.LinearFilter = 1006;
THREE.LinearMipMapNearestFilter = 1007;
THREE.LinearMipMapLinearFilter = 1008;

// Data types

THREE.UnsignedByteType = 1009;
THREE.ByteType = 1010;
THREE.ShortType = 1011;
THREE.UnsignedShortType = 1012;
THREE.IntType = 1013;
THREE.UnsignedIntType = 1014;
THREE.FloatType = 1015;

// Pixel types

//THREE.UnsignedByteType = 1009;
THREE.UnsignedShort4444Type = 1016;
THREE.UnsignedShort5551Type = 1017;
THREE.UnsignedShort565Type = 1018;

// Pixel formats

THREE.AlphaFormat = 1019;
THREE.RGBFormat = 1020;
THREE.RGBAFormat = 1021;
THREE.LuminanceFormat = 1022;
THREE.LuminanceAlphaFormat = 1023;

// DDS / ST3C Compressed texture formats

THREE.RGB_S3TC_DXT1_Format = 2001;
THREE.RGBA_S3TC_DXT1_Format = 2002;
THREE.RGBA_S3TC_DXT3_Format = 2003;
THREE.RGBA_S3TC_DXT5_Format = 2004;


// PVRTC compressed texture formats

THREE.RGB_PVRTC_4BPPV1_Format = 2100;
THREE.RGB_PVRTC_2BPPV1_Format = 2101;
THREE.RGBA_PVRTC_4BPPV1_Format = 2102;
THREE.RGBA_PVRTC_2BPPV1_Format = 2103;


// File:src/math/Color.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Color = function ( color ) {

	if ( arguments.length === 3 ) {

		return this.setRGB( arguments[ 0 ], arguments[ 1 ], arguments[ 2 ] );

	}

	return this.set( color )

};

THREE.Color.prototype = {

	constructor: THREE.Color,

	r: 1, g: 1, b: 1,

	set: function ( value ) {

		if ( value instanceof THREE.Color ) {

			this.copy( value );

		} else if ( typeof value === 'number' ) {

			this.setHex( value );

		} else if ( typeof value === 'string' ) {

			this.setStyle( value );

		}

		return this;

	},

	setHex: function ( hex ) {

		hex = Math.floor( hex );

		this.r = ( hex >> 16 & 255 ) / 255;
		this.g = ( hex >> 8 & 255 ) / 255;
		this.b = ( hex & 255 ) / 255;

		return this;

	},

	setRGB: function ( r, g, b ) {

		this.r = r;
		this.g = g;
		this.b = b;

		return this;

	},

	setHSL: function ( h, s, l ) {

		// h,s,l ranges are in 0.0 - 1.0

		if ( s === 0 ) {

			this.r = this.g = this.b = l;

		} else {

			var hue2rgb = function ( p, q, t ) {

				if ( t < 0 ) t += 1;
				if ( t > 1 ) t -= 1;
				if ( t < 1 / 6 ) return p + ( q - p ) * 6 * t;
				if ( t < 1 / 2 ) return q;
				if ( t < 2 / 3 ) return p + ( q - p ) * 6 * ( 2 / 3 - t );
				return p;

			};

			var p = l <= 0.5 ? l * ( 1 + s ) : l + s - ( l * s );
			var q = ( 2 * l ) - p;

			this.r = hue2rgb( q, p, h + 1 / 3 );
			this.g = hue2rgb( q, p, h );
			this.b = hue2rgb( q, p, h - 1 / 3 );

		}

		return this;

	},

	setStyle: function ( style ) {

		// rgb(255,0,0)

		if ( /^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.test( style ) ) {

			var color = /^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.exec( style );

			this.r = Math.min( 255, parseInt( color[ 1 ], 10 ) ) / 255;
			this.g = Math.min( 255, parseInt( color[ 2 ], 10 ) ) / 255;
			this.b = Math.min( 255, parseInt( color[ 3 ], 10 ) ) / 255;

			return this;

		}

		// rgb(100%,0%,0%)

		if ( /^rgb\((\d+)\%, ?(\d+)\%, ?(\d+)\%\)$/i.test( style ) ) {

			var color = /^rgb\((\d+)\%, ?(\d+)\%, ?(\d+)\%\)$/i.exec( style );

			this.r = Math.min( 100, parseInt( color[ 1 ], 10 ) ) / 100;
			this.g = Math.min( 100, parseInt( color[ 2 ], 10 ) ) / 100;
			this.b = Math.min( 100, parseInt( color[ 3 ], 10 ) ) / 100;

			return this;

		}

		// #ff0000

		if ( /^\#([0-9a-f]{6})$/i.test( style ) ) {

			var color = /^\#([0-9a-f]{6})$/i.exec( style );

			this.setHex( parseInt( color[ 1 ], 16 ) );

			return this;

		}

		// #f00

		if ( /^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.test( style ) ) {

			var color = /^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec( style );

			this.setHex( parseInt( color[ 1 ] + color[ 1 ] + color[ 2 ] + color[ 2 ] + color[ 3 ] + color[ 3 ], 16 ) );

			return this;

		}

		// red

		if ( /^(\w+)$/i.test( style ) ) {

			this.setHex( THREE.ColorKeywords[ style ] );

			return this;

		}


	},

	copy: function ( color ) {

		this.r = color.r;
		this.g = color.g;
		this.b = color.b;

		return this;

	},

	copyGammaToLinear: function ( color ) {

		this.r = color.r * color.r;
		this.g = color.g * color.g;
		this.b = color.b * color.b;

		return this;

	},

	copyLinearToGamma: function ( color ) {

		this.r = Math.sqrt( color.r );
		this.g = Math.sqrt( color.g );
		this.b = Math.sqrt( color.b );

		return this;

	},

	convertGammaToLinear: function () {

		var r = this.r, g = this.g, b = this.b;

		this.r = r * r;
		this.g = g * g;
		this.b = b * b;

		return this;

	},

	convertLinearToGamma: function () {

		this.r = Math.sqrt( this.r );
		this.g = Math.sqrt( this.g );
		this.b = Math.sqrt( this.b );

		return this;

	},

	getHex: function () {

		return ( this.r * 255 ) << 16 ^ ( this.g * 255 ) << 8 ^ ( this.b * 255 ) << 0;

	},

	getHexString: function () {

		return ( '000000' + this.getHex().toString( 16 ) ).slice( - 6 );

	},

	getHSL: function ( optionalTarget ) {

		// h,s,l ranges are in 0.0 - 1.0

		var hsl = optionalTarget || { h: 0, s: 0, l: 0 };

		var r = this.r, g = this.g, b = this.b;

		var max = Math.max( r, g, b );
		var min = Math.min( r, g, b );

		var hue, saturation;
		var lightness = ( min + max ) / 2.0;

		if ( min === max ) {

			hue = 0;
			saturation = 0;

		} else {

			var delta = max - min;

			saturation = lightness <= 0.5 ? delta / ( max + min ) : delta / ( 2 - max - min );

			switch ( max ) {

				case r: hue = ( g - b ) / delta + ( g < b ? 6 : 0 ); break;
				case g: hue = ( b - r ) / delta + 2; break;
				case b: hue = ( r - g ) / delta + 4; break;

			}

			hue /= 6;

		}

		hsl.h = hue;
		hsl.s = saturation;
		hsl.l = lightness;

		return hsl;

	},

	getStyle: function () {

		return 'rgb(' + ( ( this.r * 255 ) | 0 ) + ',' + ( ( this.g * 255 ) | 0 ) + ',' + ( ( this.b * 255 ) | 0 ) + ')';

	},

	offsetHSL: function ( h, s, l ) {

		var hsl = this.getHSL();

		hsl.h += h; hsl.s += s; hsl.l += l;

		this.setHSL( hsl.h, hsl.s, hsl.l );

		return this;

	},

	add: function ( color ) {

		this.r += color.r;
		this.g += color.g;
		this.b += color.b;

		return this;

	},

	addColors: function ( color1, color2 ) {

		this.r = color1.r + color2.r;
		this.g = color1.g + color2.g;
		this.b = color1.b + color2.b;

		return this;

	},

	addScalar: function ( s ) {

		this.r += s;
		this.g += s;
		this.b += s;

		return this;

	},

	multiply: function ( color ) {

		this.r *= color.r;
		this.g *= color.g;
		this.b *= color.b;

		return this;

	},

	multiplyScalar: function ( s ) {

		this.r *= s;
		this.g *= s;
		this.b *= s;

		return this;

	},

	lerp: function ( color, alpha ) {

		this.r += ( color.r - this.r ) * alpha;
		this.g += ( color.g - this.g ) * alpha;
		this.b += ( color.b - this.b ) * alpha;

		return this;

	},

	equals: function ( c ) {

		return ( c.r === this.r ) && ( c.g === this.g ) && ( c.b === this.b );

	},

	fromArray: function ( array ) {

		this.r = array[ 0 ];
		this.g = array[ 1 ];
		this.b = array[ 2 ];

		return this;

	},

	toArray: function () {

		return [ this.r, this.g, this.b ];

	},

	clone: function () {

		return new THREE.Color().setRGB( this.r, this.g, this.b );

	}

};

THREE.ColorKeywords = { 'aliceblue': 0xF0F8FF, 'antiquewhite': 0xFAEBD7, 'aqua': 0x00FFFF, 'aquamarine': 0x7FFFD4, 'azure': 0xF0FFFF,
'beige': 0xF5F5DC, 'bisque': 0xFFE4C4, 'black': 0x000000, 'blanchedalmond': 0xFFEBCD, 'blue': 0x0000FF, 'blueviolet': 0x8A2BE2,
'brown': 0xA52A2A, 'burlywood': 0xDEB887, 'cadetblue': 0x5F9EA0, 'chartreuse': 0x7FFF00, 'chocolate': 0xD2691E, 'coral': 0xFF7F50,
'cornflowerblue': 0x6495ED, 'cornsilk': 0xFFF8DC, 'crimson': 0xDC143C, 'cyan': 0x00FFFF, 'darkblue': 0x00008B, 'darkcyan': 0x008B8B,
'darkgoldenrod': 0xB8860B, 'darkgray': 0xA9A9A9, 'darkgreen': 0x006400, 'darkgrey': 0xA9A9A9, 'darkkhaki': 0xBDB76B, 'darkmagenta': 0x8B008B,
'darkolivegreen': 0x556B2F, 'darkorange': 0xFF8C00, 'darkorchid': 0x9932CC, 'darkred': 0x8B0000, 'darksalmon': 0xE9967A, 'darkseagreen': 0x8FBC8F,
'darkslateblue': 0x483D8B, 'darkslategray': 0x2F4F4F, 'darkslategrey': 0x2F4F4F, 'darkturquoise': 0x00CED1, 'darkviolet': 0x9400D3,
'deeppink': 0xFF1493, 'deepskyblue': 0x00BFFF, 'dimgray': 0x696969, 'dimgrey': 0x696969, 'dodgerblue': 0x1E90FF, 'firebrick': 0xB22222,
'floralwhite': 0xFFFAF0, 'forestgreen': 0x228B22, 'fuchsia': 0xFF00FF, 'gainsboro': 0xDCDCDC, 'ghostwhite': 0xF8F8FF, 'gold': 0xFFD700,
'goldenrod': 0xDAA520, 'gray': 0x808080, 'green': 0x008000, 'greenyellow': 0xADFF2F, 'grey': 0x808080, 'honeydew': 0xF0FFF0, 'hotpink': 0xFF69B4,
'indianred': 0xCD5C5C, 'indigo': 0x4B0082, 'ivory': 0xFFFFF0, 'khaki': 0xF0E68C, 'lavender': 0xE6E6FA, 'lavenderblush': 0xFFF0F5, 'lawngreen': 0x7CFC00,
'lemonchiffon': 0xFFFACD, 'lightblue': 0xADD8E6, 'lightcoral': 0xF08080, 'lightcyan': 0xE0FFFF, 'lightgoldenrodyellow': 0xFAFAD2, 'lightgray': 0xD3D3D3,
'lightgreen': 0x90EE90, 'lightgrey': 0xD3D3D3, 'lightpink': 0xFFB6C1, 'lightsalmon': 0xFFA07A, 'lightseagreen': 0x20B2AA, 'lightskyblue': 0x87CEFA,
'lightslategray': 0x778899, 'lightslategrey': 0x778899, 'lightsteelblue': 0xB0C4DE, 'lightyellow': 0xFFFFE0, 'lime': 0x00FF00, 'limegreen': 0x32CD32,
'linen': 0xFAF0E6, 'magenta': 0xFF00FF, 'maroon': 0x800000, 'mediumaquamarine': 0x66CDAA, 'mediumblue': 0x0000CD, 'mediumorchid': 0xBA55D3,
'mediumpurple': 0x9370DB, 'mediumseagreen': 0x3CB371, 'mediumslateblue': 0x7B68EE, 'mediumspringgreen': 0x00FA9A, 'mediumturquoise': 0x48D1CC,
'mediumvioletred': 0xC71585, 'midnightblue': 0x191970, 'mintcream': 0xF5FFFA, 'mistyrose': 0xFFE4E1, 'moccasin': 0xFFE4B5, 'navajowhite': 0xFFDEAD,
'navy': 0x000080, 'oldlace': 0xFDF5E6, 'olive': 0x808000, 'olivedrab': 0x6B8E23, 'orange': 0xFFA500, 'orangered': 0xFF4500, 'orchid': 0xDA70D6,
'palegoldenrod': 0xEEE8AA, 'palegreen': 0x98FB98, 'paleturquoise': 0xAFEEEE, 'palevioletred': 0xDB7093, 'papayawhip': 0xFFEFD5, 'peachpuff': 0xFFDAB9,
'peru': 0xCD853F, 'pink': 0xFFC0CB, 'plum': 0xDDA0DD, 'powderblue': 0xB0E0E6, 'purple': 0x800080, 'red': 0xFF0000, 'rosybrown': 0xBC8F8F,
'royalblue': 0x4169E1, 'saddlebrown': 0x8B4513, 'salmon': 0xFA8072, 'sandybrown': 0xF4A460, 'seagreen': 0x2E8B57, 'seashell': 0xFFF5EE,
'sienna': 0xA0522D, 'silver': 0xC0C0C0, 'skyblue': 0x87CEEB, 'slateblue': 0x6A5ACD, 'slategray': 0x708090, 'slategrey': 0x708090, 'snow': 0xFFFAFA,
'springgreen': 0x00FF7F, 'steelblue': 0x4682B4, 'tan': 0xD2B48C, 'teal': 0x008080, 'thistle': 0xD8BFD8, 'tomato': 0xFF6347, 'turquoise': 0x40E0D0,
'violet': 0xEE82EE, 'wheat': 0xF5DEB3, 'white': 0xFFFFFF, 'whitesmoke': 0xF5F5F5, 'yellow': 0xFFFF00, 'yellowgreen': 0x9ACD32 };

// File:src/math/Quaternion.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://exocortex.com
 */

THREE.Quaternion = function ( x, y, z, w ) {

	this._x = x || 0;
	this._y = y || 0;
	this._z = z || 0;
	this._w = ( w !== undefined ) ? w : 1;

};

THREE.Quaternion.prototype = {

	constructor: THREE.Quaternion,

	_x: 0,_y: 0, _z: 0, _w: 0,

	get x () {

		return this._x;

	},

	set x ( value ) {

		this._x = value;
		this.onChangeCallback();

	},

	get y () {

		return this._y;

	},

	set y ( value ) {

		this._y = value;
		this.onChangeCallback();

	},

	get z () {

		return this._z;

	},

	set z ( value ) {

		this._z = value;
		this.onChangeCallback();

	},

	get w () {

		return this._w;

	},

	set w ( value ) {

		this._w = value;
		this.onChangeCallback();

	},

	set: function ( x, y, z, w ) {

		this._x = x;
		this._y = y;
		this._z = z;
		this._w = w;

		this.onChangeCallback();

		return this;

	},

	copy: function ( quaternion ) {

		this._x = quaternion.x;
		this._y = quaternion.y;
		this._z = quaternion.z;
		this._w = quaternion.w;

		this.onChangeCallback();

		return this;

	},

	setFromEuler: function ( euler, update ) {

		if ( euler instanceof THREE.Euler === false ) {

			throw new Error( 'THREE.Quaternion: .setFromEuler() now expects a Euler rotation rather than a Vector3 and order.' );
		}

		// http://www.mathworks.com/matlabcentral/fileexchange/
		// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
		//	content/SpinCalc.m

		var c1 = Math.cos( euler._x / 2 );
		var c2 = Math.cos( euler._y / 2 );
		var c3 = Math.cos( euler._z / 2 );
		var s1 = Math.sin( euler._x / 2 );
		var s2 = Math.sin( euler._y / 2 );
		var s3 = Math.sin( euler._z / 2 );

		if ( euler.order === 'XYZ' ) {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;

		} else if ( euler.order === 'YXZ' ) {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;

		} else if ( euler.order === 'ZXY' ) {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;

		} else if ( euler.order === 'ZYX' ) {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;

		} else if ( euler.order === 'YZX' ) {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;

		} else if ( euler.order === 'XZY' ) {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;

		}

		if ( update !== false ) this.onChangeCallback();

		return this;

	},

	setFromAxisAngle: function ( axis, angle ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

		// assumes axis is normalized

		var halfAngle = angle / 2, s = Math.sin( halfAngle );

		this._x = axis.x * s;
		this._y = axis.y * s;
		this._z = axis.z * s;
		this._w = Math.cos( halfAngle );

		this.onChangeCallback();

		return this;

	},

	setFromRotationMatrix: function ( m ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		var te = m.elements,

			m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
			m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
			m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],

			trace = m11 + m22 + m33,
			s;

		if ( trace > 0 ) {

			s = 0.5 / Math.sqrt( trace + 1.0 );

			this._w = 0.25 / s;
			this._x = ( m32 - m23 ) * s;
			this._y = ( m13 - m31 ) * s;
			this._z = ( m21 - m12 ) * s;

		} else if ( m11 > m22 && m11 > m33 ) {

			s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

			this._w = ( m32 - m23 ) / s;
			this._x = 0.25 * s;
			this._y = ( m12 + m21 ) / s;
			this._z = ( m13 + m31 ) / s;

		} else if ( m22 > m33 ) {

			s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

			this._w = ( m13 - m31 ) / s;
			this._x = ( m12 + m21 ) / s;
			this._y = 0.25 * s;
			this._z = ( m23 + m32 ) / s;

		} else {

			s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

			this._w = ( m21 - m12 ) / s;
			this._x = ( m13 + m31 ) / s;
			this._y = ( m23 + m32 ) / s;
			this._z = 0.25 * s;

		}

		this.onChangeCallback();

		return this;

	},

	setFromUnitVectors: function () {

		// http://lolengine.net/blog/2014/02/24/quaternion-from-two-vectors-final

		// assumes direction vectors vFrom and vTo are normalized

		var v1, r;

		var EPS = 0.000001;

		return function ( vFrom, vTo ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();

			r = vFrom.dot( vTo ) + 1;

			if ( r < EPS ) {

				r = 0;

				if ( Math.abs( vFrom.x ) > Math.abs( vFrom.z ) ) {

					v1.set( - vFrom.y, vFrom.x, 0 );

				} else {

					v1.set( 0, - vFrom.z, vFrom.y );

				}

			} else {

				v1.crossVectors( vFrom, vTo );

			}

			this._x = v1.x;
			this._y = v1.y;
			this._z = v1.z;
			this._w = r;

			this.normalize();

			return this;

		}

	}(),

	inverse: function () {

		this.conjugate().normalize();

		return this;

	},

	conjugate: function () {

		this._x *= - 1;
		this._y *= - 1;
		this._z *= - 1;

		this.onChangeCallback();

		return this;

	},

	dot: function ( v ) {

		return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;

	},

	lengthSq: function () {

		return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;

	},

	length: function () {

		return Math.sqrt( this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w );

	},

	normalize: function () {

		var l = this.length();

		if ( l === 0 ) {

			this._x = 0;
			this._y = 0;
			this._z = 0;
			this._w = 1;

		} else {

			l = 1 / l;

			this._x = this._x * l;
			this._y = this._y * l;
			this._z = this._z * l;
			this._w = this._w * l;

		}

		this.onChangeCallback();

		return this;

	},

	multiply: function ( q, p ) {

		if ( p !== undefined ) {

			console.warn( 'THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.' );
			return this.multiplyQuaternions( q, p );

		}

		return this.multiplyQuaternions( this, q );

	},

	multiplyQuaternions: function ( a, b ) {

		// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

		var qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
		var qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;

		this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

		this.onChangeCallback();

		return this;

	},

	multiplyVector3: function ( vector ) {

		console.warn( 'THREE.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead.' );
		return vector.applyQuaternion( this );

	},

	slerp: function ( qb, t ) {

		if ( t === 0 ) return this;
		if ( t === 1 ) return this.copy( qb );

		var x = this._x, y = this._y, z = this._z, w = this._w;

		// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

		var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

		if ( cosHalfTheta < 0 ) {

			this._w = - qb._w;
			this._x = - qb._x;
			this._y = - qb._y;
			this._z = - qb._z;

			cosHalfTheta = - cosHalfTheta;

		} else {

			this.copy( qb );

		}

		if ( cosHalfTheta >= 1.0 ) {

			this._w = w;
			this._x = x;
			this._y = y;
			this._z = z;

			return this;

		}

		var halfTheta = Math.acos( cosHalfTheta );
		var sinHalfTheta = Math.sqrt( 1.0 - cosHalfTheta * cosHalfTheta );

		if ( Math.abs( sinHalfTheta ) < 0.001 ) {

			this._w = 0.5 * ( w + this._w );
			this._x = 0.5 * ( x + this._x );
			this._y = 0.5 * ( y + this._y );
			this._z = 0.5 * ( z + this._z );

			return this;

		}

		var ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
		ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;

		this._w = ( w * ratioA + this._w * ratioB );
		this._x = ( x * ratioA + this._x * ratioB );
		this._y = ( y * ratioA + this._y * ratioB );
		this._z = ( z * ratioA + this._z * ratioB );

		this.onChangeCallback();

		return this;

	},

	equals: function ( quaternion ) {

		return ( quaternion._x === this._x ) && ( quaternion._y === this._y ) && ( quaternion._z === this._z ) && ( quaternion._w === this._w );

	},

	fromArray: function ( array, offset ) {

		if ( offset === undefined ) offset = 0;

		this._x = array[ offset ];
		this._y = array[ offset + 1 ];
		this._z = array[ offset + 2 ];
		this._w = array[ offset + 3 ];

		this.onChangeCallback();

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this._x;
		array[ offset + 1 ] = this._y;
		array[ offset + 2 ] = this._z;
		array[ offset + 3 ] = this._w;

		return array;

	},

	onChange: function ( callback ) {

		this.onChangeCallback = callback;

		return this;

	},

	onChangeCallback: function () {},

	clone: function () {

		return new THREE.Quaternion( this._x, this._y, this._z, this._w );

	}

};

THREE.Quaternion.slerp = function ( qa, qb, qm, t ) {

	return qm.copy( qa ).slerp( qb, t );

}

// File:src/math/Vector2.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author philogb / http://blog.thejit.org/
 * @author egraether / http://egraether.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

THREE.Vector2 = function ( x, y ) {

	this.x = x || 0;
	this.y = y || 0;

};

THREE.Vector2.prototype = {

	constructor: THREE.Vector2,

	set: function ( x, y ) {

		this.x = x;
		this.y = y;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},

	setComponent: function ( index, value ) {

		switch ( index ) {

			case 0: this.x = value; break;
			case 1: this.y = value; break;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	getComponent: function ( index ) {

		switch ( index ) {

			case 0: return this.x;
			case 1: return this.y;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;

		return this;

	},

	add: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors( v, w );

		}

		this.x += v.x;
		this.y += v.y;

		return this;

	},

	addVectors: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;

		return this;

	},

	sub: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
			return this.subVectors( v, w );

		}

		this.x -= v.x;
		this.y -= v.y;

		return this;

	},

	subVectors: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;

		return this;

	},

	multiply: function ( v ) {

		this.x *= v.x;
		this.y *= v.y;

		return this;

	},

	multiplyScalar: function ( s ) {

		this.x *= s;
		this.y *= s;

		return this;

	},

	divide: function ( v ) {

		this.x /= v.x;
		this.y /= v.y;

		return this;

	},

	divideScalar: function ( scalar ) {

		if ( scalar !== 0 ) {

			var invScalar = 1 / scalar;

			this.x *= invScalar;
			this.y *= invScalar;

		} else {

			this.x = 0;
			this.y = 0;

		}

		return this;

	},

	min: function ( v ) {

		if ( this.x > v.x ) {

			this.x = v.x;

		}

		if ( this.y > v.y ) {

			this.y = v.y;

		}

		return this;

	},

	max: function ( v ) {

		if ( this.x < v.x ) {

			this.x = v.x;

		}

		if ( this.y < v.y ) {

			this.y = v.y;

		}

		return this;

	},

	clamp: function ( min, max ) {

		// This function assumes min < max, if this assumption isn't true it will not operate correctly

		if ( this.x < min.x ) {

			this.x = min.x;

		} else if ( this.x > max.x ) {

			this.x = max.x;

		}

		if ( this.y < min.y ) {

			this.y = min.y;

		} else if ( this.y > max.y ) {

			this.y = max.y;

		}

		return this;
	},

	clampScalar: ( function () {

		var min, max;

		return function ( minVal, maxVal ) {

			if ( min === undefined ) {

				min = new THREE.Vector2();
				max = new THREE.Vector2();

			}

			min.set( minVal, minVal );
			max.set( maxVal, maxVal );

			return this.clamp( min, max );

		};

	} )(),

	floor: function () {

		this.x = Math.floor( this.x );
		this.y = Math.floor( this.y );

		return this;

	},

	ceil: function () {

		this.x = Math.ceil( this.x );
		this.y = Math.ceil( this.y );

		return this;

	},

	round: function () {

		this.x = Math.round( this.x );
		this.y = Math.round( this.y );

		return this;

	},

	roundToZero: function () {

		this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
		this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );

		return this;

	},

	negate: function () {

		this.x = - this.x;
		this.y = - this.y;

		return this;

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y;

	},

	length: function () {

		return Math.sqrt( this.x * this.x + this.y * this.y );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared: function ( v ) {

		var dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;

	},

	setLength: function ( l ) {

		var oldLength = this.length();

		if ( oldLength !== 0 && l !== oldLength ) {

			this.multiplyScalar( l / oldLength );
		}

		return this;

	},

	lerp: function ( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;

		return this;

	},

	equals: function ( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) );

	},

	fromArray: function ( array, offset ) {

		if ( offset === undefined ) offset = 0;

		this.x = array[ offset ];
		this.y = array[ offset + 1 ];

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this.x;
		array[ offset + 1 ] = this.y;

		return array;

	},

	clone: function () {

		return new THREE.Vector2( this.x, this.y );

	}

};

// File:src/math/Vector3.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author *kile / http://kile.stravaganza.org/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.Vector3 = function ( x, y, z ) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;

};

THREE.Vector3.prototype = {

	constructor: THREE.Vector3,

	set: function ( x, y, z ) {

		this.x = x;
		this.y = y;
		this.z = z;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},

	setZ: function ( z ) {

		this.z = z;

		return this;

	},

	setComponent: function ( index, value ) {

		switch ( index ) {

			case 0: this.x = value; break;
			case 1: this.y = value; break;
			case 2: this.z = value; break;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	getComponent: function ( index ) {

		switch ( index ) {

			case 0: return this.x;
			case 1: return this.y;
			case 2: return this.z;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;

		return this;

	},

	add: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors( v, w );

		}

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;
		this.z += s;

		return this;

	},

	addVectors: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;

		return this;

	},

	sub: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
			return this.subVectors( v, w );

		}

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;

		return this;

	},

	subVectors: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;

		return this;

	},

	multiply: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.' );
			return this.multiplyVectors( v, w );

		}

		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;

		return this;

	},

	multiplyScalar: function ( scalar ) {

		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;

		return this;

	},

	multiplyVectors: function ( a, b ) {

		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;

		return this;

	},

	applyEuler: function () {

		var quaternion;

		return function ( euler ) {

			if ( euler instanceof THREE.Euler === false ) {

				console.error( 'THREE.Vector3: .applyEuler() now expects a Euler rotation rather than a Vector3 and order.' );

			}

			if ( quaternion === undefined ) quaternion = new THREE.Quaternion();

			this.applyQuaternion( quaternion.setFromEuler( euler ) );

			return this;

		};

	}(),

	applyAxisAngle: function () {

		var quaternion;

		return function ( axis, angle ) {

			if ( quaternion === undefined ) quaternion = new THREE.Quaternion();

			this.applyQuaternion( quaternion.setFromAxisAngle( axis, angle ) );

			return this;

		};

	}(),

	applyMatrix3: function ( m ) {

		var x = this.x;
		var y = this.y;
		var z = this.z;

		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
		this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
		this.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;

		return this;

	},

	applyMatrix4: function ( m ) {

		// input: THREE.Matrix4 affine matrix

		var x = this.x, y = this.y, z = this.z;

		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z + e[ 12 ];
		this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z + e[ 13 ];
		this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ];

		return this;

	},

	applyProjection: function ( m ) {

		// input: THREE.Matrix4 projection matrix

		var x = this.x, y = this.y, z = this.z;

		var e = m.elements;
		var d = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] ); // perspective divide

		this.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z + e[ 12 ] ) * d;
		this.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z + e[ 13 ] ) * d;
		this.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * d;

		return this;

	},

	applyQuaternion: function ( q ) {

		var x = this.x;
		var y = this.y;
		var z = this.z;

		var qx = q.x;
		var qy = q.y;
		var qz = q.z;
		var qw = q.w;

		// calculate quat * vector

		var ix =  qw * x + qy * z - qz * y;
		var iy =  qw * y + qz * x - qx * z;
		var iz =  qw * z + qx * y - qy * x;
		var iw = - qx * x - qy * y - qz * z;

		// calculate result * inverse quat

		this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
		this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
		this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

		return this;

	},

	project: function () {

		var matrix;

		return function ( camera ) {

			if ( matrix === undefined ) matrix = new THREE.Matrix4();

			matrix.multiplyMatrices( camera.projectionMatrix, matrix.getInverse( camera.matrixWorld ) );
			return this.applyProjection( matrix );

		};

	}(),

	unproject: function () {

		var matrix;

		return function ( camera ) {

			if ( matrix === undefined ) matrix = new THREE.Matrix4();

			matrix.multiplyMatrices( camera.matrixWorld, matrix.getInverse( camera.projectionMatrix ) );
			return this.applyProjection( matrix );

		};

	}(),

	transformDirection: function ( m ) {

		// input: THREE.Matrix4 affine matrix
		// vector interpreted as a direction

		var x = this.x, y = this.y, z = this.z;

		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z;
		this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z;
		this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z;

		this.normalize();

		return this;

	},

	divide: function ( v ) {

		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;

		return this;

	},

	divideScalar: function ( scalar ) {

		if ( scalar !== 0 ) {

			var invScalar = 1 / scalar;

			this.x *= invScalar;
			this.y *= invScalar;
			this.z *= invScalar;

		} else {

			this.x = 0;
			this.y = 0;
			this.z = 0;

		}

		return this;

	},

	min: function ( v ) {

		if ( this.x > v.x ) {

			this.x = v.x;

		}

		if ( this.y > v.y ) {

			this.y = v.y;

		}

		if ( this.z > v.z ) {

			this.z = v.z;

		}

		return this;

	},

	max: function ( v ) {

		if ( this.x < v.x ) {

			this.x = v.x;

		}

		if ( this.y < v.y ) {

			this.y = v.y;

		}

		if ( this.z < v.z ) {

			this.z = v.z;

		}

		return this;

	},

	clamp: function ( min, max ) {

		// This function assumes min < max, if this assumption isn't true it will not operate correctly

		if ( this.x < min.x ) {

			this.x = min.x;

		} else if ( this.x > max.x ) {

			this.x = max.x;

		}

		if ( this.y < min.y ) {

			this.y = min.y;

		} else if ( this.y > max.y ) {

			this.y = max.y;

		}

		if ( this.z < min.z ) {

			this.z = min.z;

		} else if ( this.z > max.z ) {

			this.z = max.z;

		}

		return this;

	},

	clampScalar: ( function () {

		var min, max;

		return function ( minVal, maxVal ) {

			if ( min === undefined ) {

				min = new THREE.Vector3();
				max = new THREE.Vector3();

			}

			min.set( minVal, minVal, minVal );
			max.set( maxVal, maxVal, maxVal );

			return this.clamp( min, max );

		};

	} )(),

	floor: function () {

		this.x = Math.floor( this.x );
		this.y = Math.floor( this.y );
		this.z = Math.floor( this.z );

		return this;

	},

	ceil: function () {

		this.x = Math.ceil( this.x );
		this.y = Math.ceil( this.y );
		this.z = Math.ceil( this.z );

		return this;

	},

	round: function () {

		this.x = Math.round( this.x );
		this.y = Math.round( this.y );
		this.z = Math.round( this.z );

		return this;

	},

	roundToZero: function () {

		this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
		this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
		this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );

		return this;

	},

	negate: function () {

		this.x = - this.x;
		this.y = - this.y;
		this.z = - this.z;

		return this;

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y + this.z * v.z;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y + this.z * this.z;

	},

	length: function () {

		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

	},

	lengthManhattan: function () {

		return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	setLength: function ( l ) {

		var oldLength = this.length();

		if ( oldLength !== 0 && l !== oldLength  ) {

			this.multiplyScalar( l / oldLength );
		}

		return this;

	},

	lerp: function ( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;
		this.z += ( v.z - this.z ) * alpha;

		return this;

	},

	cross: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.' );
			return this.crossVectors( v, w );

		}

		var x = this.x, y = this.y, z = this.z;

		this.x = y * v.z - z * v.y;
		this.y = z * v.x - x * v.z;
		this.z = x * v.y - y * v.x;

		return this;

	},

	crossVectors: function ( a, b ) {

		var ax = a.x, ay = a.y, az = a.z;
		var bx = b.x, by = b.y, bz = b.z;

		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;

		return this;

	},

	projectOnVector: function () {

		var v1, dot;

		return function ( vector ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();

			v1.copy( vector ).normalize();

			dot = this.dot( v1 );

			return this.copy( v1 ).multiplyScalar( dot );

		};

	}(),

	projectOnPlane: function () {

		var v1;

		return function ( planeNormal ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();

			v1.copy( this ).projectOnVector( planeNormal );

			return this.sub( v1 );

		}

	}(),

	reflect: function () {

		// reflect incident vector off plane orthogonal to normal
		// normal is assumed to have unit length

		var v1;

		return function ( normal ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();

			return this.sub( v1.copy( normal ).multiplyScalar( 2 * this.dot( normal ) ) );

		}

	}(),

	angleTo: function ( v ) {

		var theta = this.dot( v ) / ( this.length() * v.length() );

		// clamp, to handle numerical problems

		return Math.acos( THREE.Math.clamp( theta, - 1, 1 ) );

	},

	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared: function ( v ) {

		var dx = this.x - v.x;
		var dy = this.y - v.y;
		var dz = this.z - v.z;

		return dx * dx + dy * dy + dz * dz;

	},

	setEulerFromRotationMatrix: function ( m, order ) {

		console.error( 'THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.' );

	},

	setEulerFromQuaternion: function ( q, order ) {

		console.error( 'THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.' );

	},

	getPositionFromMatrix: function ( m ) {

		console.warn( 'THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition().' );

		return this.setFromMatrixPosition( m );

	},

	getScaleFromMatrix: function ( m ) {

		console.warn( 'THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale().' );

		return this.setFromMatrixScale( m );
	},

	getColumnFromMatrix: function ( index, matrix ) {

		console.warn( 'THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn().' );

		return this.setFromMatrixColumn( index, matrix );

	},

	setFromMatrixPosition: function ( m ) {

		this.x = m.elements[ 12 ];
		this.y = m.elements[ 13 ];
		this.z = m.elements[ 14 ];

		return this;

	},

	setFromMatrixScale: function ( m ) {

		var sx = this.set( m.elements[ 0 ], m.elements[ 1 ], m.elements[  2 ] ).length();
		var sy = this.set( m.elements[ 4 ], m.elements[ 5 ], m.elements[  6 ] ).length();
		var sz = this.set( m.elements[ 8 ], m.elements[ 9 ], m.elements[ 10 ] ).length();

		this.x = sx;
		this.y = sy;
		this.z = sz;

		return this;
	},

	setFromMatrixColumn: function ( index, matrix ) {

		var offset = index * 4;

		var me = matrix.elements;

		this.x = me[ offset ];
		this.y = me[ offset + 1 ];
		this.z = me[ offset + 2 ];

		return this;

	},

	equals: function ( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );

	},

	fromArray: function ( array, offset ) {

		if ( offset === undefined ) offset = 0;

		this.x = array[ offset ];
		this.y = array[ offset + 1 ];
		this.z = array[ offset + 2 ];

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this.x;
		array[ offset + 1 ] = this.y;
		array[ offset + 2 ] = this.z;

		return array;

	},

	clone: function () {

		return new THREE.Vector3( this.x, this.y, this.z );

	}

};

// File:src/math/Vector4.js

/**
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.Vector4 = function ( x, y, z, w ) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.w = ( w !== undefined ) ? w : 1;

};

THREE.Vector4.prototype = {

	constructor: THREE.Vector4,

	set: function ( x, y, z, w ) {

		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},

	setZ: function ( z ) {

		this.z = z;

		return this;

	},

	setW: function ( w ) {

		this.w = w;

		return this;

	},

	setComponent: function ( index, value ) {

		switch ( index ) {

			case 0: this.x = value; break;
			case 1: this.y = value; break;
			case 2: this.z = value; break;
			case 3: this.w = value; break;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	getComponent: function ( index ) {

		switch ( index ) {

			case 0: return this.x;
			case 1: return this.y;
			case 2: return this.z;
			case 3: return this.w;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		this.w = ( v.w !== undefined ) ? v.w : 1;

		return this;

	},

	add: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors( v, w );

		}

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		this.w += v.w;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;
		this.z += s;
		this.w += s;

		return this;

	},

	addVectors: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;
		this.w = a.w + b.w;

		return this;

	},

	sub: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
			return this.subVectors( v, w );

		}

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		this.w -= v.w;

		return this;

	},

	subVectors: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;
		this.w = a.w - b.w;

		return this;

	},

	multiplyScalar: function ( scalar ) {

		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		this.w *= scalar;

		return this;

	},

	applyMatrix4: function ( m ) {

		var x = this.x;
		var y = this.y;
		var z = this.z;
		var w = this.w;

		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] * w;
		this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] * w;
		this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] * w;
		this.w = e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] * w;

		return this;

	},

	divideScalar: function ( scalar ) {

		if ( scalar !== 0 ) {

			var invScalar = 1 / scalar;

			this.x *= invScalar;
			this.y *= invScalar;
			this.z *= invScalar;
			this.w *= invScalar;

		} else {

			this.x = 0;
			this.y = 0;
			this.z = 0;
			this.w = 1;

		}

		return this;

	},

	setAxisAngleFromQuaternion: function ( q ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm

		// q is assumed to be normalized

		this.w = 2 * Math.acos( q.w );

		var s = Math.sqrt( 1 - q.w * q.w );

		if ( s < 0.0001 ) {

			 this.x = 1;
			 this.y = 0;
			 this.z = 0;

		} else {

			 this.x = q.x / s;
			 this.y = q.y / s;
			 this.z = q.z / s;

		}

		return this;

	},

	setAxisAngleFromRotationMatrix: function ( m ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		var angle, x, y, z,		// variables for result
			epsilon = 0.01,		// margin to allow for rounding errors
			epsilon2 = 0.1,		// margin to distinguish between 0 and 180 degrees

			te = m.elements,

			m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
			m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
			m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

		if ( ( Math.abs( m12 - m21 ) < epsilon )
		   && ( Math.abs( m13 - m31 ) < epsilon )
		   && ( Math.abs( m23 - m32 ) < epsilon ) ) {

			// singularity found
			// first check for identity matrix which must have +1 for all terms
			// in leading diagonal and zero in other terms

			if ( ( Math.abs( m12 + m21 ) < epsilon2 )
			   && ( Math.abs( m13 + m31 ) < epsilon2 )
			   && ( Math.abs( m23 + m32 ) < epsilon2 )
			   && ( Math.abs( m11 + m22 + m33 - 3 ) < epsilon2 ) ) {

				// this singularity is identity matrix so angle = 0

				this.set( 1, 0, 0, 0 );

				return this; // zero angle, arbitrary axis

			}

			// otherwise this singularity is angle = 180

			angle = Math.PI;

			var xx = ( m11 + 1 ) / 2;
			var yy = ( m22 + 1 ) / 2;
			var zz = ( m33 + 1 ) / 2;
			var xy = ( m12 + m21 ) / 4;
			var xz = ( m13 + m31 ) / 4;
			var yz = ( m23 + m32 ) / 4;

			if ( ( xx > yy ) && ( xx > zz ) ) { // m11 is the largest diagonal term

				if ( xx < epsilon ) {

					x = 0;
					y = 0.707106781;
					z = 0.707106781;

				} else {

					x = Math.sqrt( xx );
					y = xy / x;
					z = xz / x;

				}

			} else if ( yy > zz ) { // m22 is the largest diagonal term

				if ( yy < epsilon ) {

					x = 0.707106781;
					y = 0;
					z = 0.707106781;

				} else {

					y = Math.sqrt( yy );
					x = xy / y;
					z = yz / y;

				}

			} else { // m33 is the largest diagonal term so base result on this

				if ( zz < epsilon ) {

					x = 0.707106781;
					y = 0.707106781;
					z = 0;

				} else {

					z = Math.sqrt( zz );
					x = xz / z;
					y = yz / z;

				}

			}

			this.set( x, y, z, angle );

			return this; // return 180 deg rotation

		}

		// as we have reached here there are no singularities so we can handle normally

		var s = Math.sqrt( ( m32 - m23 ) * ( m32 - m23 )
						  + ( m13 - m31 ) * ( m13 - m31 )
						  + ( m21 - m12 ) * ( m21 - m12 ) ); // used to normalize

		if ( Math.abs( s ) < 0.001 ) s = 1;

		// prevent divide by zero, should not happen if matrix is orthogonal and should be
		// caught by singularity test above, but I've left it in just in case

		this.x = ( m32 - m23 ) / s;
		this.y = ( m13 - m31 ) / s;
		this.z = ( m21 - m12 ) / s;
		this.w = Math.acos( ( m11 + m22 + m33 - 1 ) / 2 );

		return this;

	},

	min: function ( v ) {

		if ( this.x > v.x ) {

			this.x = v.x;

		}

		if ( this.y > v.y ) {

			this.y = v.y;

		}

		if ( this.z > v.z ) {

			this.z = v.z;

		}

		if ( this.w > v.w ) {

			this.w = v.w;

		}

		return this;

	},

	max: function ( v ) {

		if ( this.x < v.x ) {

			this.x = v.x;

		}

		if ( this.y < v.y ) {

			this.y = v.y;

		}

		if ( this.z < v.z ) {

			this.z = v.z;

		}

		if ( this.w < v.w ) {

			this.w = v.w;

		}

		return this;

	},

	clamp: function ( min, max ) {

		// This function assumes min < max, if this assumption isn't true it will not operate correctly

		if ( this.x < min.x ) {

			this.x = min.x;

		} else if ( this.x > max.x ) {

			this.x = max.x;

		}

		if ( this.y < min.y ) {

			this.y = min.y;

		} else if ( this.y > max.y ) {

			this.y = max.y;

		}

		if ( this.z < min.z ) {

			this.z = min.z;

		} else if ( this.z > max.z ) {

			this.z = max.z;

		}

		if ( this.w < min.w ) {

			this.w = min.w;

		} else if ( this.w > max.w ) {

			this.w = max.w;

		}

		return this;

	},

	clampScalar: ( function () {

		var min, max;

		return function ( minVal, maxVal ) {

			if ( min === undefined ) {

				min = new THREE.Vector4();
				max = new THREE.Vector4();

			}

			min.set( minVal, minVal, minVal, minVal );
			max.set( maxVal, maxVal, maxVal, maxVal );

			return this.clamp( min, max );

		};

	} )(),

    floor: function () {

        this.x = Math.floor( this.x );
        this.y = Math.floor( this.y );
        this.z = Math.floor( this.z );
        this.w = Math.floor( this.w );

        return this;

    },

    ceil: function () {

        this.x = Math.ceil( this.x );
        this.y = Math.ceil( this.y );
        this.z = Math.ceil( this.z );
        this.w = Math.ceil( this.w );

        return this;

    },

    round: function () {

        this.x = Math.round( this.x );
        this.y = Math.round( this.y );
        this.z = Math.round( this.z );
        this.w = Math.round( this.w );

        return this;

    },

    roundToZero: function () {

        this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
        this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
        this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );
        this.w = ( this.w < 0 ) ? Math.ceil( this.w ) : Math.floor( this.w );

        return this;

    },

	negate: function () {

		this.x = - this.x;
		this.y = - this.y;
		this.z = - this.z;
		this.w = - this.w;

		return this;

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;

	},

	length: function () {

		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );

	},

	lengthManhattan: function () {

		return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z ) + Math.abs( this.w );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	setLength: function ( l ) {

		var oldLength = this.length();

		if ( oldLength !== 0 && l !== oldLength ) {

			this.multiplyScalar( l / oldLength );

		}

		return this;

	},

	lerp: function ( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;
		this.z += ( v.z - this.z ) * alpha;
		this.w += ( v.w - this.w ) * alpha;

		return this;

	},

	equals: function ( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) && ( v.w === this.w ) );

	},

	fromArray: function ( array, offset ) {

		if ( offset === undefined ) offset = 0;

		this.x = array[ offset ];
		this.y = array[ offset + 1 ];
		this.z = array[ offset + 2 ];
		this.w = array[ offset + 3 ];

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this.x;
		array[ offset + 1 ] = this.y;
		array[ offset + 2 ] = this.z;
		array[ offset + 3 ] = this.w;

		return array;

	},

	clone: function () {

		return new THREE.Vector4( this.x, this.y, this.z, this.w );

	}

};

// File:src/math/Euler.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://exocortex.com
 */

THREE.Euler = function ( x, y, z, order ) {

	this._x = x || 0;
	this._y = y || 0;
	this._z = z || 0;
	this._order = order || THREE.Euler.DefaultOrder;

};

THREE.Euler.RotationOrders = [ 'XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX' ];

THREE.Euler.DefaultOrder = 'XYZ';

THREE.Euler.prototype = {

	constructor: THREE.Euler,

	_x: 0, _y: 0, _z: 0, _order: THREE.Euler.DefaultOrder,

	get x () {

		return this._x;

	},

	set x ( value ) {

		this._x = value;
		this.onChangeCallback();

	},

	get y () {

		return this._y;

	},

	set y ( value ) {

		this._y = value;
		this.onChangeCallback();

	},

	get z () {

		return this._z;

	},

	set z ( value ) {

		this._z = value;
		this.onChangeCallback();

	},

	get order () {

		return this._order;

	},

	set order ( value ) {

		this._order = value;
		this.onChangeCallback();

	},

	set: function ( x, y, z, order ) {

		this._x = x;
		this._y = y;
		this._z = z;
		this._order = order || this._order;

		this.onChangeCallback();

		return this;

	},

	copy: function ( euler ) {

		this._x = euler._x;
		this._y = euler._y;
		this._z = euler._z;
		this._order = euler._order;

		this.onChangeCallback();

		return this;

	},

	setFromRotationMatrix: function ( m, order ) {

		var clamp = THREE.Math.clamp;

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		var te = m.elements;
		var m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ];
		var m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ];
		var m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

		order = order || this._order;

		if ( order === 'XYZ' ) {

			this._y = Math.asin( clamp( m13, - 1, 1 ) );

			if ( Math.abs( m13 ) < 0.99999 ) {

				this._x = Math.atan2( - m23, m33 );
				this._z = Math.atan2( - m12, m11 );

			} else {

				this._x = Math.atan2( m32, m22 );
				this._z = 0;

			}

		} else if ( order === 'YXZ' ) {

			this._x = Math.asin( - clamp( m23, - 1, 1 ) );

			if ( Math.abs( m23 ) < 0.99999 ) {

				this._y = Math.atan2( m13, m33 );
				this._z = Math.atan2( m21, m22 );

			} else {

				this._y = Math.atan2( - m31, m11 );
				this._z = 0;

			}

		} else if ( order === 'ZXY' ) {

			this._x = Math.asin( clamp( m32, - 1, 1 ) );

			if ( Math.abs( m32 ) < 0.99999 ) {

				this._y = Math.atan2( - m31, m33 );
				this._z = Math.atan2( - m12, m22 );

			} else {

				this._y = 0;
				this._z = Math.atan2( m21, m11 );

			}

		} else if ( order === 'ZYX' ) {

			this._y = Math.asin( - clamp( m31, - 1, 1 ) );

			if ( Math.abs( m31 ) < 0.99999 ) {

				this._x = Math.atan2( m32, m33 );
				this._z = Math.atan2( m21, m11 );

			} else {

				this._x = 0;
				this._z = Math.atan2( - m12, m22 );

			}

		} else if ( order === 'YZX' ) {

			this._z = Math.asin( clamp( m21, - 1, 1 ) );

			if ( Math.abs( m21 ) < 0.99999 ) {

				this._x = Math.atan2( - m23, m22 );
				this._y = Math.atan2( - m31, m11 );

			} else {

				this._x = 0;
				this._y = Math.atan2( m13, m33 );

			}

		} else if ( order === 'XZY' ) {

			this._z = Math.asin( - clamp( m12, - 1, 1 ) );

			if ( Math.abs( m12 ) < 0.99999 ) {

				this._x = Math.atan2( m32, m22 );
				this._y = Math.atan2( m13, m11 );

			} else {

				this._x = Math.atan2( - m23, m33 );
				this._y = 0;

			}

		} else {

			console.warn( 'THREE.Euler: .setFromRotationMatrix() given unsupported order: ' + order )

		}

		this._order = order;

		this.onChangeCallback();

		return this;

	},

	setFromQuaternion: function ( q, order, update ) {

		var clamp = THREE.Math.clamp;

		// q is assumed to be normalized

		// http://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/content/SpinCalc.m

		var sqx = q.x * q.x;
		var sqy = q.y * q.y;
		var sqz = q.z * q.z;
		var sqw = q.w * q.w;

		order = order || this._order;

		if ( order === 'XYZ' ) {

			this._x = Math.atan2( 2 * ( q.x * q.w - q.y * q.z ), ( sqw - sqx - sqy + sqz ) );
			this._y = Math.asin(  clamp( 2 * ( q.x * q.z + q.y * q.w ), - 1, 1 ) );
			this._z = Math.atan2( 2 * ( q.z * q.w - q.x * q.y ), ( sqw + sqx - sqy - sqz ) );

		} else if ( order ===  'YXZ' ) {

			this._x = Math.asin(  clamp( 2 * ( q.x * q.w - q.y * q.z ), - 1, 1 ) );
			this._y = Math.atan2( 2 * ( q.x * q.z + q.y * q.w ), ( sqw - sqx - sqy + sqz ) );
			this._z = Math.atan2( 2 * ( q.x * q.y + q.z * q.w ), ( sqw - sqx + sqy - sqz ) );

		} else if ( order === 'ZXY' ) {

			this._x = Math.asin(  clamp( 2 * ( q.x * q.w + q.y * q.z ), - 1, 1 ) );
			this._y = Math.atan2( 2 * ( q.y * q.w - q.z * q.x ), ( sqw - sqx - sqy + sqz ) );
			this._z = Math.atan2( 2 * ( q.z * q.w - q.x * q.y ), ( sqw - sqx + sqy - sqz ) );

		} else if ( order === 'ZYX' ) {

			this._x = Math.atan2( 2 * ( q.x * q.w + q.z * q.y ), ( sqw - sqx - sqy + sqz ) );
			this._y = Math.asin(  clamp( 2 * ( q.y * q.w - q.x * q.z ), - 1, 1 ) );
			this._z = Math.atan2( 2 * ( q.x * q.y + q.z * q.w ), ( sqw + sqx - sqy - sqz ) );

		} else if ( order === 'YZX' ) {

			this._x = Math.atan2( 2 * ( q.x * q.w - q.z * q.y ), ( sqw - sqx + sqy - sqz ) );
			this._y = Math.atan2( 2 * ( q.y * q.w - q.x * q.z ), ( sqw + sqx - sqy - sqz ) );
			this._z = Math.asin(  clamp( 2 * ( q.x * q.y + q.z * q.w ), - 1, 1 ) );

		} else if ( order === 'XZY' ) {

			this._x = Math.atan2( 2 * ( q.x * q.w + q.y * q.z ), ( sqw - sqx + sqy - sqz ) );
			this._y = Math.atan2( 2 * ( q.x * q.z + q.y * q.w ), ( sqw + sqx - sqy - sqz ) );
			this._z = Math.asin(  clamp( 2 * ( q.z * q.w - q.x * q.y ), - 1, 1 ) );

		} else {

			console.warn( 'THREE.Euler: .setFromQuaternion() given unsupported order: ' + order )

		}

		this._order = order;

		if ( update !== false ) this.onChangeCallback();

		return this;

	},

	reorder: function () {

		// WARNING: this discards revolution information -bhouston

		var q = new THREE.Quaternion();

		return function ( newOrder ) {

			q.setFromEuler( this );
			this.setFromQuaternion( q, newOrder );

		};


	}(),

	equals: function ( euler ) {

		return ( euler._x === this._x ) && ( euler._y === this._y ) && ( euler._z === this._z ) && ( euler._order === this._order );

	},

	fromArray: function ( array ) {

		this._x = array[ 0 ];
		this._y = array[ 1 ];
		this._z = array[ 2 ];
		if ( array[ 3 ] !== undefined ) this._order = array[ 3 ];

		this.onChangeCallback();

		return this;

	},

	toArray: function () {

		return [ this._x, this._y, this._z, this._order ];

	},

	onChange: function ( callback ) {

		this.onChangeCallback = callback;

		return this;

	},

	onChangeCallback: function () {},

	clone: function () {

		return new THREE.Euler( this._x, this._y, this._z, this._order );

	}

};

// File:src/math/Line3.js

/**
 * @author bhouston / http://exocortex.com
 */

THREE.Line3 = function ( start, end ) {

	this.start = ( start !== undefined ) ? start : new THREE.Vector3();
	this.end = ( end !== undefined ) ? end : new THREE.Vector3();

};

THREE.Line3.prototype = {

	constructor: THREE.Line3,

	set: function ( start, end ) {

		this.start.copy( start );
		this.end.copy( end );

		return this;

	},

	copy: function ( line ) {

		this.start.copy( line.start );
		this.end.copy( line.end );

		return this;

	},

	center: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.addVectors( this.start, this.end ).multiplyScalar( 0.5 );

	},

	delta: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.subVectors( this.end, this.start );

	},

	distanceSq: function () {

		return this.start.distanceToSquared( this.end );

	},

	distance: function () {

		return this.start.distanceTo( this.end );

	},

	at: function ( t, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();

		return this.delta( result ).multiplyScalar( t ).add( this.start );

	},

	closestPointToPointParameter: function () {

		var startP = new THREE.Vector3();
		var startEnd = new THREE.Vector3();

		return function ( point, clampToLine ) {

			startP.subVectors( point, this.start );
			startEnd.subVectors( this.end, this.start );

			var startEnd2 = startEnd.dot( startEnd );
			var startEnd_startP = startEnd.dot( startP );

			var t = startEnd_startP / startEnd2;

			if ( clampToLine ) {

				t = THREE.Math.clamp( t, 0, 1 );

			}

			return t;

		};

	}(),

	closestPointToPoint: function ( point, clampToLine, optionalTarget ) {

		var t = this.closestPointToPointParameter( point, clampToLine );

		var result = optionalTarget || new THREE.Vector3();

		return this.delta( result ).multiplyScalar( t ).add( this.start );

	},

	applyMatrix4: function ( matrix ) {

		this.start.applyMatrix4( matrix );
		this.end.applyMatrix4( matrix );

		return this;

	},

	equals: function ( line ) {

		return line.start.equals( this.start ) && line.end.equals( this.end );

	},

	clone: function () {

		return new THREE.Line3().copy( this );

	}

};

// File:src/math/Box2.js

/**
 * @author bhouston / http://exocortex.com
 */

THREE.Box2 = function ( min, max ) {

	this.min = ( min !== undefined ) ? min : new THREE.Vector2( Infinity, Infinity );
	this.max = ( max !== undefined ) ? max : new THREE.Vector2( - Infinity, - Infinity );

};

THREE.Box2.prototype = {

	constructor: THREE.Box2,

	set: function ( min, max ) {

		this.min.copy( min );
		this.max.copy( max );

		return this;

	},

	setFromPoints: function ( points ) {

		this.makeEmpty();

		for ( var i = 0, il = points.length; i < il; i ++ ) {

			this.expandByPoint( points[ i ] )

		}

		return this;

	},

	setFromCenterAndSize: function () {

		var v1 = new THREE.Vector2();

		return function ( center, size ) {

			var halfSize = v1.copy( size ).multiplyScalar( 0.5 );
			this.min.copy( center ).sub( halfSize );
			this.max.copy( center ).add( halfSize );

			return this;

		};

	}(),

	copy: function ( box ) {

		this.min.copy( box.min );
		this.max.copy( box.max );

		return this;

	},

	makeEmpty: function () {

		this.min.x = this.min.y = Infinity;
		this.max.x = this.max.y = - Infinity;

		return this;

	},

	empty: function () {

		// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes

		return ( this.max.x < this.min.x ) || ( this.max.y < this.min.y );

	},

	center: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector2();
		return result.addVectors( this.min, this.max ).multiplyScalar( 0.5 );

	},

	size: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector2();
		return result.subVectors( this.max, this.min );

	},

	expandByPoint: function ( point ) {

		this.min.min( point );
		this.max.max( point );

		return this;
	},

	expandByVector: function ( vector ) {

		this.min.sub( vector );
		this.max.add( vector );

		return this;
	},

	expandByScalar: function ( scalar ) {

		this.min.addScalar( - scalar );
		this.max.addScalar( scalar );

		return this;
	},

	containsPoint: function ( point ) {

		if ( point.x < this.min.x || point.x > this.max.x ||
		     point.y < this.min.y || point.y > this.max.y ) {

			return false;

		}

		return true;

	},

	containsBox: function ( box ) {

		if ( ( this.min.x <= box.min.x ) && ( box.max.x <= this.max.x ) &&
		     ( this.min.y <= box.min.y ) && ( box.max.y <= this.max.y ) ) {

			return true;

		}

		return false;

	},

	getParameter: function ( point, optionalTarget ) {

		// This can potentially have a divide by zero if the box
		// has a size dimension of 0.

		var result = optionalTarget || new THREE.Vector2();

		return result.set(
			( point.x - this.min.x ) / ( this.max.x - this.min.x ),
			( point.y - this.min.y ) / ( this.max.y - this.min.y )
		);

	},

	isIntersectionBox: function ( box ) {

		// using 6 splitting planes to rule out intersections.

		if ( box.max.x < this.min.x || box.min.x > this.max.x ||
		     box.max.y < this.min.y || box.min.y > this.max.y ) {

			return false;

		}

		return true;

	},

	clampPoint: function ( point, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector2();
		return result.copy( point ).clamp( this.min, this.max );

	},

	distanceToPoint: function () {

		var v1 = new THREE.Vector2();

		return function ( point ) {

			var clampedPoint = v1.copy( point ).clamp( this.min, this.max );
			return clampedPoint.sub( point ).length();

		};

	}(),

	intersect: function ( box ) {

		this.min.max( box.min );
		this.max.min( box.max );

		return this;

	},

	union: function ( box ) {

		this.min.min( box.min );
		this.max.max( box.max );

		return this;

	},

	translate: function ( offset ) {

		this.min.add( offset );
		this.max.add( offset );

		return this;

	},

	equals: function ( box ) {

		return box.min.equals( this.min ) && box.max.equals( this.max );

	},

	clone: function () {

		return new THREE.Box2().copy( this );

	}

};

// File:src/math/Box3.js

/**
 * @author bhouston / http://exocortex.com
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.Box3 = function ( min, max ) {

	this.min = ( min !== undefined ) ? min : new THREE.Vector3( Infinity, Infinity, Infinity );
	this.max = ( max !== undefined ) ? max : new THREE.Vector3( - Infinity, - Infinity, - Infinity );

};

THREE.Box3.prototype = {

	constructor: THREE.Box3,

	set: function ( min, max ) {

		this.min.copy( min );
		this.max.copy( max );

		return this;

	},

	setFromPoints: function ( points ) {

		this.makeEmpty();

		for ( var i = 0, il = points.length; i < il; i ++ ) {

			this.expandByPoint( points[ i ] )

		}

		return this;

	},

	setFromCenterAndSize: function () {

		var v1 = new THREE.Vector3();

		return function ( center, size ) {

			var halfSize = v1.copy( size ).multiplyScalar( 0.5 );

			this.min.copy( center ).sub( halfSize );
			this.max.copy( center ).add( halfSize );

			return this;

		};

	}(),

	setFromObject: function () {

		// Computes the world-axis-aligned bounding box of an object (including its children),
		// accounting for both the object's, and childrens', world transforms

		var v1 = new THREE.Vector3();

		return function ( object ) {

			var scope = this;

			object.updateMatrixWorld( true );

			this.makeEmpty();

			object.traverse( function ( node ) {

				var geometry = node.geometry;

				if ( geometry !== undefined ) {

					if ( geometry instanceof THREE.Geometry ) {

						var vertices = geometry.vertices;

						for ( var i = 0, il = vertices.length; i < il; i ++ ) {

							v1.copy( vertices[ i ] );

							v1.applyMatrix4( node.matrixWorld );

							scope.expandByPoint( v1 );

						}

					} else if ( geometry instanceof THREE.BufferGeometry && geometry.attributes[ 'position' ] !== undefined ) {

						var positions = geometry.attributes[ 'position' ].array;

						for ( var i = 0, il = positions.length; i < il; i += 3 ) {

							v1.set( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] );

							v1.applyMatrix4( node.matrixWorld );

							scope.expandByPoint( v1 );

						}

					}

				}

			} );

			return this;

		};

	}(),

	copy: function ( box ) {

		this.min.copy( box.min );
		this.max.copy( box.max );

		return this;

	},

	makeEmpty: function () {

		this.min.x = this.min.y = this.min.z = Infinity;
		this.max.x = this.max.y = this.max.z = - Infinity;

		return this;

	},

	empty: function () {

		// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes

		return ( this.max.x < this.min.x ) || ( this.max.y < this.min.y ) || ( this.max.z < this.min.z );

	},

	center: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.addVectors( this.min, this.max ).multiplyScalar( 0.5 );

	},

	size: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.subVectors( this.max, this.min );

	},

	expandByPoint: function ( point ) {

		this.min.min( point );
		this.max.max( point );

		return this;

	},

	expandByVector: function ( vector ) {

		this.min.sub( vector );
		this.max.add( vector );

		return this;

	},

	expandByScalar: function ( scalar ) {

		this.min.addScalar( - scalar );
		this.max.addScalar( scalar );

		return this;

	},

	containsPoint: function ( point ) {

		if ( point.x < this.min.x || point.x > this.max.x ||
		     point.y < this.min.y || point.y > this.max.y ||
		     point.z < this.min.z || point.z > this.max.z ) {

			return false;

		}

		return true;

	},

	containsBox: function ( box ) {

		if ( ( this.min.x <= box.min.x ) && ( box.max.x <= this.max.x ) &&
			 ( this.min.y <= box.min.y ) && ( box.max.y <= this.max.y ) &&
			 ( this.min.z <= box.min.z ) && ( box.max.z <= this.max.z ) ) {

			return true;

		}

		return false;

	},

	getParameter: function ( point, optionalTarget ) {

		// This can potentially have a divide by zero if the box
		// has a size dimension of 0.

		var result = optionalTarget || new THREE.Vector3();

		return result.set(
			( point.x - this.min.x ) / ( this.max.x - this.min.x ),
			( point.y - this.min.y ) / ( this.max.y - this.min.y ),
			( point.z - this.min.z ) / ( this.max.z - this.min.z )
		);

	},

	isIntersectionBox: function ( box ) {

		// using 6 splitting planes to rule out intersections.

		if ( box.max.x < this.min.x || box.min.x > this.max.x ||
		     box.max.y < this.min.y || box.min.y > this.max.y ||
		     box.max.z < this.min.z || box.min.z > this.max.z ) {

			return false;

		}

		return true;

	},

	clampPoint: function ( point, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.copy( point ).clamp( this.min, this.max );

	},

	distanceToPoint: function () {

		var v1 = new THREE.Vector3();

		return function ( point ) {

			var clampedPoint = v1.copy( point ).clamp( this.min, this.max );
			return clampedPoint.sub( point ).length();

		};

	}(),

	getBoundingSphere: function () {

		var v1 = new THREE.Vector3();

		return function ( optionalTarget ) {

			var result = optionalTarget || new THREE.Sphere();

			result.center = this.center();
			result.radius = this.size( v1 ).length() * 0.5;

			return result;

		};

	}(),

	intersect: function ( box ) {

		this.min.max( box.min );
		this.max.min( box.max );

		return this;

	},

	union: function ( box ) {

		this.min.min( box.min );
		this.max.max( box.max );

		return this;

	},

	applyMatrix4: function () {

		var points = [
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3()
		];

		return function ( matrix ) {

			// NOTE: I am using a binary pattern to specify all 2^3 combinations below
			points[ 0 ].set( this.min.x, this.min.y, this.min.z ).applyMatrix4( matrix ); // 000
			points[ 1 ].set( this.min.x, this.min.y, this.max.z ).applyMatrix4( matrix ); // 001
			points[ 2 ].set( this.min.x, this.max.y, this.min.z ).applyMatrix4( matrix ); // 010
			points[ 3 ].set( this.min.x, this.max.y, this.max.z ).applyMatrix4( matrix ); // 011
			points[ 4 ].set( this.max.x, this.min.y, this.min.z ).applyMatrix4( matrix ); // 100
			points[ 5 ].set( this.max.x, this.min.y, this.max.z ).applyMatrix4( matrix ); // 101
			points[ 6 ].set( this.max.x, this.max.y, this.min.z ).applyMatrix4( matrix ); // 110
			points[ 7 ].set( this.max.x, this.max.y, this.max.z ).applyMatrix4( matrix );  // 111

			this.makeEmpty();
			this.setFromPoints( points );

			return this;

		};

	}(),

	translate: function ( offset ) {

		this.min.add( offset );
		this.max.add( offset );

		return this;

	},

	equals: function ( box ) {

		return box.min.equals( this.min ) && box.max.equals( this.max );

	},

	clone: function () {

		return new THREE.Box3().copy( this );

	}

};

// File:src/math/Matrix3.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://exocortex.com
 */

THREE.Matrix3 = function () {

	this.elements = new Float32Array( [

		1, 0, 0,
		0, 1, 0,
		0, 0, 1

	] );

	if ( arguments.length > 0 ) {

		console.error( 'THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.' );

	}

};

THREE.Matrix3.prototype = {

	constructor: THREE.Matrix3,

	set: function ( n11, n12, n13, n21, n22, n23, n31, n32, n33 ) {

		var te = this.elements;

		te[ 0 ] = n11; te[ 3 ] = n12; te[ 6 ] = n13;
		te[ 1 ] = n21; te[ 4 ] = n22; te[ 7 ] = n23;
		te[ 2 ] = n31; te[ 5 ] = n32; te[ 8 ] = n33;

		return this;

	},

	identity: function () {

		this.set(

			1, 0, 0,
			0, 1, 0,
			0, 0, 1

		);

		return this;

	},

	copy: function ( m ) {

		var me = m.elements;

		this.set(

			me[ 0 ], me[ 3 ], me[ 6 ],
			me[ 1 ], me[ 4 ], me[ 7 ],
			me[ 2 ], me[ 5 ], me[ 8 ]

		);

		return this;

	},

	multiplyVector3: function ( vector ) {

		console.warn( 'THREE.Matrix3: .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead.' );
		return vector.applyMatrix3( this );

	},

	multiplyVector3Array: function ( a ) {

		console.warn( 'THREE.Matrix3: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.' );
		return this.applyToVector3Array( a );

	},

	applyToVector3Array: function () {

		var v1 = new THREE.Vector3();

		return function ( array, offset, length ) {

			if ( offset === undefined ) offset = 0;
			if ( length === undefined ) length = array.length;

			for ( var i = 0, j = offset, il; i < length; i += 3, j += 3 ) {

				v1.x = array[ j ];
				v1.y = array[ j + 1 ];
				v1.z = array[ j + 2 ];

				v1.applyMatrix3( this );

				array[ j ]     = v1.x;
				array[ j + 1 ] = v1.y;
				array[ j + 2 ] = v1.z;

			}

			return array;

		};

	}(),

	multiplyScalar: function ( s ) {

		var te = this.elements;

		te[ 0 ] *= s; te[ 3 ] *= s; te[ 6 ] *= s;
		te[ 1 ] *= s; te[ 4 ] *= s; te[ 7 ] *= s;
		te[ 2 ] *= s; te[ 5 ] *= s; te[ 8 ] *= s;

		return this;

	},

	determinant: function () {

		var te = this.elements;

		var a = te[ 0 ], b = te[ 1 ], c = te[ 2 ],
			d = te[ 3 ], e = te[ 4 ], f = te[ 5 ],
			g = te[ 6 ], h = te[ 7 ], i = te[ 8 ];

		return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;

	},

	getInverse: function ( matrix, throwOnInvertible ) {

		// input: THREE.Matrix4
		// ( based on http://code.google.com/p/webgl-mjs/ )

		var me = matrix.elements;
		var te = this.elements;

		te[ 0 ] =   me[ 10 ] * me[ 5 ] - me[ 6 ] * me[ 9 ];
		te[ 1 ] = - me[ 10 ] * me[ 1 ] + me[ 2 ] * me[ 9 ];
		te[ 2 ] =   me[ 6 ] * me[ 1 ] - me[ 2 ] * me[ 5 ];
		te[ 3 ] = - me[ 10 ] * me[ 4 ] + me[ 6 ] * me[ 8 ];
		te[ 4 ] =   me[ 10 ] * me[ 0 ] - me[ 2 ] * me[ 8 ];
		te[ 5 ] = - me[ 6 ] * me[ 0 ] + me[ 2 ] * me[ 4 ];
		te[ 6 ] =   me[ 9 ] * me[ 4 ] - me[ 5 ] * me[ 8 ];
		te[ 7 ] = - me[ 9 ] * me[ 0 ] + me[ 1 ] * me[ 8 ];
		te[ 8 ] =   me[ 5 ] * me[ 0 ] - me[ 1 ] * me[ 4 ];

		var det = me[ 0 ] * te[ 0 ] + me[ 1 ] * te[ 3 ] + me[ 2 ] * te[ 6 ];

		// no inverse

		if ( det === 0 ) {

			var msg = "Matrix3.getInverse(): can't invert matrix, determinant is 0";

			if ( throwOnInvertible || false ) {

				throw new Error( msg );

			} else {

				console.warn( msg );

			}

			this.identity();

			return this;

		}

		this.multiplyScalar( 1.0 / det );

		return this;

	},

	transpose: function () {

		var tmp, m = this.elements;

		tmp = m[ 1 ]; m[ 1 ] = m[ 3 ]; m[ 3 ] = tmp;
		tmp = m[ 2 ]; m[ 2 ] = m[ 6 ]; m[ 6 ] = tmp;
		tmp = m[ 5 ]; m[ 5 ] = m[ 7 ]; m[ 7 ] = tmp;

		return this;

	},

	flattenToArrayOffset: function ( array, offset ) {

		var te = this.elements;

		array[ offset     ] = te[ 0 ];
		array[ offset + 1 ] = te[ 1 ];
		array[ offset + 2 ] = te[ 2 ];

		array[ offset + 3 ] = te[ 3 ];
		array[ offset + 4 ] = te[ 4 ];
		array[ offset + 5 ] = te[ 5 ];

		array[ offset + 6 ] = te[ 6 ];
		array[ offset + 7 ] = te[ 7 ];
		array[ offset + 8 ]  = te[ 8 ];

		return array;

	},

	getNormalMatrix: function ( m ) {

		// input: THREE.Matrix4

		this.getInverse( m ).transpose();

		return this;

	},

	transposeIntoArray: function ( r ) {

		var m = this.elements;

		r[ 0 ] = m[ 0 ];
		r[ 1 ] = m[ 3 ];
		r[ 2 ] = m[ 6 ];
		r[ 3 ] = m[ 1 ];
		r[ 4 ] = m[ 4 ];
		r[ 5 ] = m[ 7 ];
		r[ 6 ] = m[ 2 ];
		r[ 7 ] = m[ 5 ];
		r[ 8 ] = m[ 8 ];

		return this;

	},

	fromArray: function ( array ) {

		this.elements.set( array );

		return this;

	},

	toArray: function () {

		var te = this.elements;

		return [
			te[ 0 ], te[ 1 ], te[ 2 ],
			te[ 3 ], te[ 4 ], te[ 5 ],
			te[ 6 ], te[ 7 ], te[ 8 ]
		];

	},

	clone: function () {

		return new THREE.Matrix3().fromArray( this.elements );

	}

};

// File:src/math/Matrix4.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author jordi_ros / http://plattsoft.com
 * @author D1plo1d / http://github.com/D1plo1d
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author timknip / http://www.floorplanner.com/
 * @author bhouston / http://exocortex.com
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.Matrix4 = function () {

	this.elements = new Float32Array( [

		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1

	] );

	if ( arguments.length > 0 ) {

		console.error( 'THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.' );

	}

};

THREE.Matrix4.prototype = {

	constructor: THREE.Matrix4,

	set: function ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

		var te = this.elements;

		te[ 0 ] = n11; te[ 4 ] = n12; te[ 8 ] = n13; te[ 12 ] = n14;
		te[ 1 ] = n21; te[ 5 ] = n22; te[ 9 ] = n23; te[ 13 ] = n24;
		te[ 2 ] = n31; te[ 6 ] = n32; te[ 10 ] = n33; te[ 14 ] = n34;
		te[ 3 ] = n41; te[ 7 ] = n42; te[ 11 ] = n43; te[ 15 ] = n44;

		return this;

	},

	identity: function () {

		this.set(

			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1

		);

		return this;

	},

	copy: function ( m ) {

		this.elements.set( m.elements );

		return this;

	},

	extractPosition: function ( m ) {

		console.warn( 'THREE.Matrix4: .extractPosition() has been renamed to .copyPosition().' );
		return this.copyPosition( m );

	},

	copyPosition: function ( m ) {

		var te = this.elements;
		var me = m.elements;

		te[ 12 ] = me[ 12 ];
		te[ 13 ] = me[ 13 ];
		te[ 14 ] = me[ 14 ];

		return this;

	},

	extractRotation: function () {

		var v1 = new THREE.Vector3();

		return function ( m ) {

			var te = this.elements;
			var me = m.elements;

			var scaleX = 1 / v1.set( me[ 0 ], me[ 1 ], me[ 2 ] ).length();
			var scaleY = 1 / v1.set( me[ 4 ], me[ 5 ], me[ 6 ] ).length();
			var scaleZ = 1 / v1.set( me[ 8 ], me[ 9 ], me[ 10 ] ).length();

			te[ 0 ] = me[ 0 ] * scaleX;
			te[ 1 ] = me[ 1 ] * scaleX;
			te[ 2 ] = me[ 2 ] * scaleX;

			te[ 4 ] = me[ 4 ] * scaleY;
			te[ 5 ] = me[ 5 ] * scaleY;
			te[ 6 ] = me[ 6 ] * scaleY;

			te[ 8 ] = me[ 8 ] * scaleZ;
			te[ 9 ] = me[ 9 ] * scaleZ;
			te[ 10 ] = me[ 10 ] * scaleZ;

			return this;

		};

	}(),

	makeRotationFromEuler: function ( euler ) {

		if ( euler instanceof THREE.Euler === false ) {

			console.error( 'THREE.Matrix: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.' );

		}

		var te = this.elements;

		var x = euler.x, y = euler.y, z = euler.z;
		var a = Math.cos( x ), b = Math.sin( x );
		var c = Math.cos( y ), d = Math.sin( y );
		var e = Math.cos( z ), f = Math.sin( z );

		if ( euler.order === 'XYZ' ) {

			var ae = a * e, af = a * f, be = b * e, bf = b * f;

			te[ 0 ] = c * e;
			te[ 4 ] = - c * f;
			te[ 8 ] = d;

			te[ 1 ] = af + be * d;
			te[ 5 ] = ae - bf * d;
			te[ 9 ] = - b * c;

			te[ 2 ] = bf - ae * d;
			te[ 6 ] = be + af * d;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'YXZ' ) {

			var ce = c * e, cf = c * f, de = d * e, df = d * f;

			te[ 0 ] = ce + df * b;
			te[ 4 ] = de * b - cf;
			te[ 8 ] = a * d;

			te[ 1 ] = a * f;
			te[ 5 ] = a * e;
			te[ 9 ] = - b;

			te[ 2 ] = cf * b - de;
			te[ 6 ] = df + ce * b;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'ZXY' ) {

			var ce = c * e, cf = c * f, de = d * e, df = d * f;

			te[ 0 ] = ce - df * b;
			te[ 4 ] = - a * f;
			te[ 8 ] = de + cf * b;

			te[ 1 ] = cf + de * b;
			te[ 5 ] = a * e;
			te[ 9 ] = df - ce * b;

			te[ 2 ] = - a * d;
			te[ 6 ] = b;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'ZYX' ) {

			var ae = a * e, af = a * f, be = b * e, bf = b * f;

			te[ 0 ] = c * e;
			te[ 4 ] = be * d - af;
			te[ 8 ] = ae * d + bf;

			te[ 1 ] = c * f;
			te[ 5 ] = bf * d + ae;
			te[ 9 ] = af * d - be;

			te[ 2 ] = - d;
			te[ 6 ] = b * c;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'YZX' ) {

			var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

			te[ 0 ] = c * e;
			te[ 4 ] = bd - ac * f;
			te[ 8 ] = bc * f + ad;

			te[ 1 ] = f;
			te[ 5 ] = a * e;
			te[ 9 ] = - b * e;

			te[ 2 ] = - d * e;
			te[ 6 ] = ad * f + bc;
			te[ 10 ] = ac - bd * f;

		} else if ( euler.order === 'XZY' ) {

			var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

			te[ 0 ] = c * e;
			te[ 4 ] = - f;
			te[ 8 ] = d * e;

			te[ 1 ] = ac * f + bd;
			te[ 5 ] = a * e;
			te[ 9 ] = ad * f - bc;

			te[ 2 ] = bc * f - ad;
			te[ 6 ] = b * e;
			te[ 10 ] = bd * f + ac;

		}

		// last column
		te[ 3 ] = 0;
		te[ 7 ] = 0;
		te[ 11 ] = 0;

		// bottom row
		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;

		return this;

	},

	setRotationFromQuaternion: function ( q ) {

		console.warn( 'THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion().' );

		return this.makeRotationFromQuaternion( q );

	},

	makeRotationFromQuaternion: function ( q ) {

		var te = this.elements;

		var x = q.x, y = q.y, z = q.z, w = q.w;
		var x2 = x + x, y2 = y + y, z2 = z + z;
		var xx = x * x2, xy = x * y2, xz = x * z2;
		var yy = y * y2, yz = y * z2, zz = z * z2;
		var wx = w * x2, wy = w * y2, wz = w * z2;

		te[ 0 ] = 1 - ( yy + zz );
		te[ 4 ] = xy - wz;
		te[ 8 ] = xz + wy;

		te[ 1 ] = xy + wz;
		te[ 5 ] = 1 - ( xx + zz );
		te[ 9 ] = yz - wx;

		te[ 2 ] = xz - wy;
		te[ 6 ] = yz + wx;
		te[ 10 ] = 1 - ( xx + yy );

		// last column
		te[ 3 ] = 0;
		te[ 7 ] = 0;
		te[ 11 ] = 0;

		// bottom row
		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;

		return this;

	},

	lookAt: function () {

		var x = new THREE.Vector3();
		var y = new THREE.Vector3();
		var z = new THREE.Vector3();

		return function ( eye, target, up ) {

			var te = this.elements;

			z.subVectors( eye, target ).normalize();

			if ( z.length() === 0 ) {

				z.z = 1;

			}

			x.crossVectors( up, z ).normalize();

			if ( x.length() === 0 ) {

				z.x += 0.0001;
				x.crossVectors( up, z ).normalize();

			}

			y.crossVectors( z, x );


			te[ 0 ] = x.x; te[ 4 ] = y.x; te[ 8 ] = z.x;
			te[ 1 ] = x.y; te[ 5 ] = y.y; te[ 9 ] = z.y;
			te[ 2 ] = x.z; te[ 6 ] = y.z; te[ 10 ] = z.z;

			return this;

		};

	}(),

	multiply: function ( m, n ) {

		if ( n !== undefined ) {

			console.warn( 'THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead.' );
			return this.multiplyMatrices( m, n );

		}

		return this.multiplyMatrices( this, m );

	},

	multiplyMatrices: function ( a, b ) {

		var ae = a.elements;
		var be = b.elements;
		var te = this.elements;

		var a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
		var a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
		var a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
		var a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];

		var b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
		var b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
		var b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
		var b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];

		te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		te[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		te[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		te[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

		te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		te[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		te[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		te[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

		te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		te[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		te[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		te[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		te[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		te[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		te[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		te[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

		return this;

	},

	multiplyToArray: function ( a, b, r ) {

		var te = this.elements;

		this.multiplyMatrices( a, b );

		r[ 0 ] = te[ 0 ]; r[ 1 ] = te[ 1 ]; r[ 2 ] = te[ 2 ]; r[ 3 ] = te[ 3 ];
		r[ 4 ] = te[ 4 ]; r[ 5 ] = te[ 5 ]; r[ 6 ] = te[ 6 ]; r[ 7 ] = te[ 7 ];
		r[ 8 ]  = te[ 8 ]; r[ 9 ]  = te[ 9 ]; r[ 10 ] = te[ 10 ]; r[ 11 ] = te[ 11 ];
		r[ 12 ] = te[ 12 ]; r[ 13 ] = te[ 13 ]; r[ 14 ] = te[ 14 ]; r[ 15 ] = te[ 15 ];

		return this;

	},

	multiplyScalar: function ( s ) {

		var te = this.elements;

		te[ 0 ] *= s; te[ 4 ] *= s; te[ 8 ] *= s; te[ 12 ] *= s;
		te[ 1 ] *= s; te[ 5 ] *= s; te[ 9 ] *= s; te[ 13 ] *= s;
		te[ 2 ] *= s; te[ 6 ] *= s; te[ 10 ] *= s; te[ 14 ] *= s;
		te[ 3 ] *= s; te[ 7 ] *= s; te[ 11 ] *= s; te[ 15 ] *= s;

		return this;

	},

	multiplyVector3: function ( vector ) {

		console.warn( 'THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) or vector.applyProjection( matrix ) instead.' );
		return vector.applyProjection( this );

	},

	multiplyVector4: function ( vector ) {

		console.warn( 'THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead.' );
		return vector.applyMatrix4( this );

	},

	multiplyVector3Array: function ( a ) {

		console.warn( 'THREE.Matrix4: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.' );
		return this.applyToVector3Array( a );

	},

	applyToVector3Array: function () {

		var v1 = new THREE.Vector3();

		return function ( array, offset, length ) {

			if ( offset === undefined ) offset = 0;
			if ( length === undefined ) length = array.length;

			for ( var i = 0, j = offset, il; i < length; i += 3, j += 3 ) {

				v1.x = array[ j ];
				v1.y = array[ j + 1 ];
				v1.z = array[ j + 2 ];

				v1.applyMatrix4( this );

				array[ j ]     = v1.x;
				array[ j + 1 ] = v1.y;
				array[ j + 2 ] = v1.z;

			}

			return array;

		};

	}(),

	rotateAxis: function ( v ) {

		console.warn( 'THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead.' );

		v.transformDirection( this );

	},

	crossVector: function ( vector ) {

		console.warn( 'THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead.' );
		return vector.applyMatrix4( this );

	},

	determinant: function () {

		var te = this.elements;

		var n11 = te[ 0 ], n12 = te[ 4 ], n13 = te[ 8 ], n14 = te[ 12 ];
		var n21 = te[ 1 ], n22 = te[ 5 ], n23 = te[ 9 ], n24 = te[ 13 ];
		var n31 = te[ 2 ], n32 = te[ 6 ], n33 = te[ 10 ], n34 = te[ 14 ];
		var n41 = te[ 3 ], n42 = te[ 7 ], n43 = te[ 11 ], n44 = te[ 15 ];

		//TODO: make this more efficient
		//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

		return (
			n41 * (
				+ n14 * n23 * n32
				 - n13 * n24 * n32
				 - n14 * n22 * n33
				 + n12 * n24 * n33
				 + n13 * n22 * n34
				 - n12 * n23 * n34
			) +
			n42 * (
				+ n11 * n23 * n34
				 - n11 * n24 * n33
				 + n14 * n21 * n33
				 - n13 * n21 * n34
				 + n13 * n24 * n31
				 - n14 * n23 * n31
			) +
			n43 * (
				+ n11 * n24 * n32
				 - n11 * n22 * n34
				 - n14 * n21 * n32
				 + n12 * n21 * n34
				 + n14 * n22 * n31
				 - n12 * n24 * n31
			) +
			n44 * (
				- n13 * n22 * n31
				 - n11 * n23 * n32
				 + n11 * n22 * n33
				 + n13 * n21 * n32
				 - n12 * n21 * n33
				 + n12 * n23 * n31
			)

		);

	},

	transpose: function () {

		var te = this.elements;
		var tmp;

		tmp = te[ 1 ]; te[ 1 ] = te[ 4 ]; te[ 4 ] = tmp;
		tmp = te[ 2 ]; te[ 2 ] = te[ 8 ]; te[ 8 ] = tmp;
		tmp = te[ 6 ]; te[ 6 ] = te[ 9 ]; te[ 9 ] = tmp;

		tmp = te[ 3 ]; te[ 3 ] = te[ 12 ]; te[ 12 ] = tmp;
		tmp = te[ 7 ]; te[ 7 ] = te[ 13 ]; te[ 13 ] = tmp;
		tmp = te[ 11 ]; te[ 11 ] = te[ 14 ]; te[ 14 ] = tmp;

		return this;

	},

	flattenToArrayOffset: function ( array, offset ) {

		var te = this.elements;

		array[ offset     ] = te[ 0 ];
		array[ offset + 1 ] = te[ 1 ];
		array[ offset + 2 ] = te[ 2 ];
		array[ offset + 3 ] = te[ 3 ];

		array[ offset + 4 ] = te[ 4 ];
		array[ offset + 5 ] = te[ 5 ];
		array[ offset + 6 ] = te[ 6 ];
		array[ offset + 7 ] = te[ 7 ];

		array[ offset + 8 ]  = te[ 8 ];
		array[ offset + 9 ]  = te[ 9 ];
		array[ offset + 10 ] = te[ 10 ];
		array[ offset + 11 ] = te[ 11 ];

		array[ offset + 12 ] = te[ 12 ];
		array[ offset + 13 ] = te[ 13 ];
		array[ offset + 14 ] = te[ 14 ];
		array[ offset + 15 ] = te[ 15 ];

		return array;

	},

	getPosition: function () {

		var v1 = new THREE.Vector3();

		return function () {

			console.warn( 'THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead.' );

			var te = this.elements;
			return v1.set( te[ 12 ], te[ 13 ], te[ 14 ] );

		};

	}(),

	setPosition: function ( v ) {

		var te = this.elements;

		te[ 12 ] = v.x;
		te[ 13 ] = v.y;
		te[ 14 ] = v.z;

		return this;

	},

	getInverse: function ( m, throwOnInvertible ) {

		// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		var te = this.elements;
		var me = m.elements;

		var n11 = me[ 0 ], n12 = me[ 4 ], n13 = me[ 8 ], n14 = me[ 12 ];
		var n21 = me[ 1 ], n22 = me[ 5 ], n23 = me[ 9 ], n24 = me[ 13 ];
		var n31 = me[ 2 ], n32 = me[ 6 ], n33 = me[ 10 ], n34 = me[ 14 ];
		var n41 = me[ 3 ], n42 = me[ 7 ], n43 = me[ 11 ], n44 = me[ 15 ];

		te[ 0 ] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
		te[ 4 ] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
		te[ 8 ] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
		te[ 12 ] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
		te[ 1 ] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
		te[ 5 ] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
		te[ 9 ] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
		te[ 13 ] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
		te[ 2 ] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
		te[ 6 ] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
		te[ 10 ] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
		te[ 14 ] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
		te[ 3 ] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
		te[ 7 ] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
		te[ 11 ] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
		te[ 15 ] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

		var det = n11 * te[ 0 ] + n21 * te[ 4 ] + n31 * te[ 8 ] + n41 * te[ 12 ];

		if ( det == 0 ) {

			var msg = "Matrix4.getInverse(): can't invert matrix, determinant is 0";

			if ( throwOnInvertible || false ) {

				throw new Error( msg );

			} else {

				console.warn( msg );

			}

			this.identity();

			return this;
		}

		this.multiplyScalar( 1 / det );

		return this;

	},

	translate: function ( v ) {

		console.warn( 'THREE.Matrix4: .translate() has been removed.' );

	},

	rotateX: function ( angle ) {

		console.warn( 'THREE.Matrix4: .rotateX() has been removed.' );

	},

	rotateY: function ( angle ) {

		console.warn( 'THREE.Matrix4: .rotateY() has been removed.' );

	},

	rotateZ: function ( angle ) {

		console.warn( 'THREE.Matrix4: .rotateZ() has been removed.' );

	},

	rotateByAxis: function ( axis, angle ) {

		console.warn( 'THREE.Matrix4: .rotateByAxis() has been removed.' );

	},

	scale: function ( v ) {

		var te = this.elements;
		var x = v.x, y = v.y, z = v.z;

		te[ 0 ] *= x; te[ 4 ] *= y; te[ 8 ] *= z;
		te[ 1 ] *= x; te[ 5 ] *= y; te[ 9 ] *= z;
		te[ 2 ] *= x; te[ 6 ] *= y; te[ 10 ] *= z;
		te[ 3 ] *= x; te[ 7 ] *= y; te[ 11 ] *= z;

		return this;

	},

	getMaxScaleOnAxis: function () {

		var te = this.elements;

		var scaleXSq = te[ 0 ] * te[ 0 ] + te[ 1 ] * te[ 1 ] + te[ 2 ] * te[ 2 ];
		var scaleYSq = te[ 4 ] * te[ 4 ] + te[ 5 ] * te[ 5 ] + te[ 6 ] * te[ 6 ];
		var scaleZSq = te[ 8 ] * te[ 8 ] + te[ 9 ] * te[ 9 ] + te[ 10 ] * te[ 10 ];

		return Math.sqrt( Math.max( scaleXSq, Math.max( scaleYSq, scaleZSq ) ) );

	},

	makeTranslation: function ( x, y, z ) {

		this.set(

			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1

		);

		return this;

	},

	makeRotationX: function ( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			1, 0,  0, 0,
			0, c, - s, 0,
			0, s,  c, 0,
			0, 0,  0, 1

		);

		return this;

	},

	makeRotationY: function ( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			 c, 0, s, 0,
			 0, 1, 0, 0,
			- s, 0, c, 0,
			 0, 0, 0, 1

		);

		return this;

	},

	makeRotationZ: function ( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			c, - s, 0, 0,
			s,  c, 0, 0,
			0,  0, 1, 0,
			0,  0, 0, 1

		);

		return this;

	},

	makeRotationAxis: function ( axis, angle ) {

		// Based on http://www.gamedev.net/reference/articles/article1199.asp

		var c = Math.cos( angle );
		var s = Math.sin( angle );
		var t = 1 - c;
		var x = axis.x, y = axis.y, z = axis.z;
		var tx = t * x, ty = t * y;

		this.set(

			tx * x + c, tx * y - s * z, tx * z + s * y, 0,
			tx * y + s * z, ty * y + c, ty * z - s * x, 0,
			tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
			0, 0, 0, 1

		);

		 return this;

	},

	makeScale: function ( x, y, z ) {

		this.set(

			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1

		);

		return this;

	},

	compose: function ( position, quaternion, scale ) {

		this.makeRotationFromQuaternion( quaternion );
		this.scale( scale );
		this.setPosition( position );

		return this;

	},

	decompose: function () {

		var vector = new THREE.Vector3();
		var matrix = new THREE.Matrix4();

		return function ( position, quaternion, scale ) {

			var te = this.elements;

			var sx = vector.set( te[ 0 ], te[ 1 ], te[ 2 ] ).length();
			var sy = vector.set( te[ 4 ], te[ 5 ], te[ 6 ] ).length();
			var sz = vector.set( te[ 8 ], te[ 9 ], te[ 10 ] ).length();

			// if determine is negative, we need to invert one scale
			var det = this.determinant();
			if ( det < 0 ) {
				sx = - sx;
			}

			position.x = te[ 12 ];
			position.y = te[ 13 ];
			position.z = te[ 14 ];

			// scale the rotation part

			matrix.elements.set( this.elements ); // at this point matrix is incomplete so we can't use .copy()

			var invSX = 1 / sx;
			var invSY = 1 / sy;
			var invSZ = 1 / sz;

			matrix.elements[ 0 ] *= invSX;
			matrix.elements[ 1 ] *= invSX;
			matrix.elements[ 2 ] *= invSX;

			matrix.elements[ 4 ] *= invSY;
			matrix.elements[ 5 ] *= invSY;
			matrix.elements[ 6 ] *= invSY;

			matrix.elements[ 8 ] *= invSZ;
			matrix.elements[ 9 ] *= invSZ;
			matrix.elements[ 10 ] *= invSZ;

			quaternion.setFromRotationMatrix( matrix );

			scale.x = sx;
			scale.y = sy;
			scale.z = sz;

			return this;

		};

	}(),

	makeFrustum: function ( left, right, bottom, top, near, far ) {

		var te = this.elements;
		var x = 2 * near / ( right - left );
		var y = 2 * near / ( top - bottom );

		var a = ( right + left ) / ( right - left );
		var b = ( top + bottom ) / ( top - bottom );
		var c = - ( far + near ) / ( far - near );
		var d = - 2 * far * near / ( far - near );

		te[ 0 ] = x;	te[ 4 ] = 0;	te[ 8 ] = a;	te[ 12 ] = 0;
		te[ 1 ] = 0;	te[ 5 ] = y;	te[ 9 ] = b;	te[ 13 ] = 0;
		te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = c;	te[ 14 ] = d;
		te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = - 1;	te[ 15 ] = 0;

		return this;

	},

	makePerspective: function ( fov, aspect, near, far ) {

		var ymax = near * Math.tan( THREE.Math.degToRad( fov * 0.5 ) );
		var ymin = - ymax;
		var xmin = ymin * aspect;
		var xmax = ymax * aspect;

		return this.makeFrustum( xmin, xmax, ymin, ymax, near, far );

	},

	makeOrthographic: function ( left, right, top, bottom, near, far ) {

		var te = this.elements;
		var w = right - left;
		var h = top - bottom;
		var p = far - near;

		var x = ( right + left ) / w;
		var y = ( top + bottom ) / h;
		var z = ( far + near ) / p;

		te[ 0 ] = 2 / w;	te[ 4 ] = 0;	te[ 8 ] = 0;	te[ 12 ] = - x;
		te[ 1 ] = 0;	te[ 5 ] = 2 / h;	te[ 9 ] = 0;	te[ 13 ] = - y;
		te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = - 2 / p;	te[ 14 ] = - z;
		te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = 0;	te[ 15 ] = 1;

		return this;

	},

	fromArray: function ( array ) {

		this.elements.set( array );

		return this;

	},

	toArray: function () {

		var te = this.elements;

		return [
			te[ 0 ], te[ 1 ], te[ 2 ], te[ 3 ],
			te[ 4 ], te[ 5 ], te[ 6 ], te[ 7 ],
			te[ 8 ], te[ 9 ], te[ 10 ], te[ 11 ],
			te[ 12 ], te[ 13 ], te[ 14 ], te[ 15 ]
		];

	},

	clone: function () {

		return new THREE.Matrix4().fromArray( this.elements );

	}

};

// File:src/math/Ray.js

/**
 * @author bhouston / http://exocortex.com
 */

THREE.Ray = function ( origin, direction ) {

	this.origin = ( origin !== undefined ) ? origin : new THREE.Vector3();
	this.direction = ( direction !== undefined ) ? direction : new THREE.Vector3();

};

THREE.Ray.prototype = {

	constructor: THREE.Ray,

	set: function ( origin, direction ) {

		this.origin.copy( origin );
		this.direction.copy( direction );

		return this;

	},

	copy: function ( ray ) {

		this.origin.copy( ray.origin );
		this.direction.copy( ray.direction );

		return this;

	},

	at: function ( t, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();

		return result.copy( this.direction ).multiplyScalar( t ).add( this.origin );

	},

	recast: function () {

		var v1 = new THREE.Vector3();

		return function ( t ) {

			this.origin.copy( this.at( t, v1 ) );

			return this;

		};

	}(),

	closestPointToPoint: function ( point, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		result.subVectors( point, this.origin );
		var directionDistance = result.dot( this.direction );

		if ( directionDistance < 0 ) {

			return result.copy( this.origin );

		}

		return result.copy( this.direction ).multiplyScalar( directionDistance ).add( this.origin );

	},

	distanceToPoint: function () {

		var v1 = new THREE.Vector3();

		return function ( point ) {

			var directionDistance = v1.subVectors( point, this.origin ).dot( this.direction );

			// point behind the ray

			if ( directionDistance < 0 ) {

				return this.origin.distanceTo( point );

			}

			v1.copy( this.direction ).multiplyScalar( directionDistance ).add( this.origin );

			return v1.distanceTo( point );

		};

	}(),

	distanceSqToSegment: function ( v0, v1, optionalPointOnRay, optionalPointOnSegment ) {

		// from http://www.geometrictools.com/LibMathematics/Distance/Wm5DistRay3Segment3.cpp
		// It returns the min distance between the ray and the segment
		// defined by v0 and v1
		// It can also set two optional targets :
		// - The closest point on the ray
		// - The closest point on the segment

		var segCenter = v0.clone().add( v1 ).multiplyScalar( 0.5 );
		var segDir = v1.clone().sub( v0 ).normalize();
		var segExtent = v0.distanceTo( v1 ) * 0.5;
		var diff = this.origin.clone().sub( segCenter );
		var a01 = - this.direction.dot( segDir );
		var b0 = diff.dot( this.direction );
		var b1 = - diff.dot( segDir );
		var c = diff.lengthSq();
		var det = Math.abs( 1 - a01 * a01 );
		var s0, s1, sqrDist, extDet;

		if ( det >= 0 ) {

			// The ray and segment are not parallel.

			s0 = a01 * b1 - b0;
			s1 = a01 * b0 - b1;
			extDet = segExtent * det;

			if ( s0 >= 0 ) {

				if ( s1 >= - extDet ) {

					if ( s1 <= extDet ) {

						// region 0
						// Minimum at interior points of ray and segment.

						var invDet = 1 / det;
						s0 *= invDet;
						s1 *= invDet;
						sqrDist = s0 * ( s0 + a01 * s1 + 2 * b0 ) + s1 * ( a01 * s0 + s1 + 2 * b1 ) + c;

					} else {

						// region 1

						s1 = segExtent;
						s0 = Math.max( 0, - ( a01 * s1 + b0 ) );
						sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

					}

				} else {

					// region 5

					s1 = - segExtent;
					s0 = Math.max( 0, - ( a01 * s1 + b0 ) );
					sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

				}

			} else {

				if ( s1 <= - extDet ) {

					// region 4

					s0 = Math.max( 0, - ( - a01 * segExtent + b0 ) );
					s1 = ( s0 > 0 ) ? - segExtent : Math.min( Math.max( - segExtent, - b1 ), segExtent );
					sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

				} else if ( s1 <= extDet ) {

					// region 3

					s0 = 0;
					s1 = Math.min( Math.max( - segExtent, - b1 ), segExtent );
					sqrDist = s1 * ( s1 + 2 * b1 ) + c;

				} else {

					// region 2

					s0 = Math.max( 0, - ( a01 * segExtent + b0 ) );
					s1 = ( s0 > 0 ) ? segExtent : Math.min( Math.max( - segExtent, - b1 ), segExtent );
					sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

				}

			}

		} else {

			// Ray and segment are parallel.

			s1 = ( a01 > 0 ) ? - segExtent : segExtent;
			s0 = Math.max( 0, - ( a01 * s1 + b0 ) );
			sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

		}

		if ( optionalPointOnRay ) {

			optionalPointOnRay.copy( this.direction.clone().multiplyScalar( s0 ).add( this.origin ) );

		}

		if ( optionalPointOnSegment ) {

			optionalPointOnSegment.copy( segDir.clone().multiplyScalar( s1 ).add( segCenter ) );

		}

		return sqrDist;

	},

	isIntersectionSphere: function ( sphere ) {

		return this.distanceToPoint( sphere.center ) <= sphere.radius;

	},

	intersectSphere: function () {

		// from http://www.scratchapixel.com/lessons/3d-basic-lessons/lesson-7-intersecting-simple-shapes/ray-sphere-intersection/

		var v1 = new THREE.Vector3();

		return function ( sphere, optionalTarget ) {

			v1.subVectors( sphere.center, this.origin );

			var tca = v1.dot( this.direction );

			var d2 = v1.dot( v1 ) - tca * tca;

			var radius2 = sphere.radius * sphere.radius;

			if ( d2 > radius2 ) return null;

			var thc = Math.sqrt( radius2 - d2 );

			// t0 = first intersect point - entrance on front of sphere
			var t0 = tca - thc;

			// t1 = second intersect point - exit point on back of sphere
			var t1 = tca + thc;

			// test to see if both t0 and t1 are behind the ray - if so, return null
			if ( t0 < 0 && t1 < 0 ) return null;

			// test to see if t0 is behind the ray:
			// if it is, the ray is inside the sphere, so return the second exit point scaled by t1,
			// in order to always return an intersect point that is in front of the ray.
			if ( t0 < 0 ) return this.at( t1, optionalTarget );

			// else t0 is in front of the ray, so return the first collision point scaled by t0 
			return this.at( t0, optionalTarget );

		}

	}(),

	isIntersectionPlane: function ( plane ) {

		// check if the ray lies on the plane first

		var distToPoint = plane.distanceToPoint( this.origin );

		if ( distToPoint === 0 ) {

			return true;

		}

		var denominator = plane.normal.dot( this.direction );

		if ( denominator * distToPoint < 0 ) {

			return true;

		}

		// ray origin is behind the plane (and is pointing behind it)

		return false;

	},

	distanceToPlane: function ( plane ) {

		var denominator = plane.normal.dot( this.direction );
		if ( denominator == 0 ) {

			// line is coplanar, return origin
			if ( plane.distanceToPoint( this.origin ) == 0 ) {

				return 0;

			}

			// Null is preferable to undefined since undefined means.... it is undefined

			return null;

		}

		var t = - ( this.origin.dot( plane.normal ) + plane.constant ) / denominator;

		// Return if the ray never intersects the plane

		return t >= 0 ? t :  null;

	},

	intersectPlane: function ( plane, optionalTarget ) {

		var t = this.distanceToPlane( plane );

		if ( t === null ) {

			return null;
		}

		return this.at( t, optionalTarget );

	},

	isIntersectionBox: function () {

		var v = new THREE.Vector3();

		return function ( box ) {

			return this.intersectBox( box, v ) !== null;

		};

	}(),

	intersectBox: function ( box , optionalTarget ) {

		// http://www.scratchapixel.com/lessons/3d-basic-lessons/lesson-7-intersecting-simple-shapes/ray-box-intersection/

		var tmin,tmax,tymin,tymax,tzmin,tzmax;

		var invdirx = 1 / this.direction.x,
			invdiry = 1 / this.direction.y,
			invdirz = 1 / this.direction.z;

		var origin = this.origin;

		if ( invdirx >= 0 ) {

			tmin = ( box.min.x - origin.x ) * invdirx;
			tmax = ( box.max.x - origin.x ) * invdirx;

		} else {

			tmin = ( box.max.x - origin.x ) * invdirx;
			tmax = ( box.min.x - origin.x ) * invdirx;
		}

		if ( invdiry >= 0 ) {

			tymin = ( box.min.y - origin.y ) * invdiry;
			tymax = ( box.max.y - origin.y ) * invdiry;

		} else {

			tymin = ( box.max.y - origin.y ) * invdiry;
			tymax = ( box.min.y - origin.y ) * invdiry;
		}

		if ( ( tmin > tymax ) || ( tymin > tmax ) ) return null;

		// These lines also handle the case where tmin or tmax is NaN
		// (result of 0 * Infinity). x !== x returns true if x is NaN

		if ( tymin > tmin || tmin !== tmin ) tmin = tymin;

		if ( tymax < tmax || tmax !== tmax ) tmax = tymax;

		if ( invdirz >= 0 ) {

			tzmin = ( box.min.z - origin.z ) * invdirz;
			tzmax = ( box.max.z - origin.z ) * invdirz;

		} else {

			tzmin = ( box.max.z - origin.z ) * invdirz;
			tzmax = ( box.min.z - origin.z ) * invdirz;
		}

		if ( ( tmin > tzmax ) || ( tzmin > tmax ) ) return null;

		if ( tzmin > tmin || tmin !== tmin ) tmin = tzmin;

		if ( tzmax < tmax || tmax !== tmax ) tmax = tzmax;

		//return point closest to the ray (positive side)

		if ( tmax < 0 ) return null;

		return this.at( tmin >= 0 ? tmin : tmax, optionalTarget );

	},

	intersectTriangle: function () {

		// Compute the offset origin, edges, and normal.
		var diff = new THREE.Vector3();
		var edge1 = new THREE.Vector3();
		var edge2 = new THREE.Vector3();
		var normal = new THREE.Vector3();

		return function ( a, b, c, backfaceCulling, optionalTarget ) {

			// from http://www.geometrictools.com/LibMathematics/Intersection/Wm5IntrRay3Triangle3.cpp

			edge1.subVectors( b, a );
			edge2.subVectors( c, a );
			normal.crossVectors( edge1, edge2 );

			// Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
			// E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
			//   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
			//   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
			//   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)
			var DdN = this.direction.dot( normal );
			var sign;

			if ( DdN > 0 ) {

				if ( backfaceCulling ) return null;
				sign = 1;

			} else if ( DdN < 0 ) {

				sign = - 1;
				DdN = - DdN;

			} else {

				return null;

			}

			diff.subVectors( this.origin, a );
			var DdQxE2 = sign * this.direction.dot( edge2.crossVectors( diff, edge2 ) );

			// b1 < 0, no intersection
			if ( DdQxE2 < 0 ) {

				return null;

			}

			var DdE1xQ = sign * this.direction.dot( edge1.cross( diff ) );

			// b2 < 0, no intersection
			if ( DdE1xQ < 0 ) {

				return null;

			}

			// b1+b2 > 1, no intersection
			if ( DdQxE2 + DdE1xQ > DdN ) {

				return null;

			}

			// Line intersects triangle, check if ray does.
			var QdN = - sign * diff.dot( normal );

			// t < 0, no intersection
			if ( QdN < 0 ) {

				return null;

			}

			// Ray intersects triangle.
			return this.at( QdN / DdN, optionalTarget );

		};

	}(),

	applyMatrix4: function ( matrix4 ) {

		this.direction.add( this.origin ).applyMatrix4( matrix4 );
		this.origin.applyMatrix4( matrix4 );
		this.direction.sub( this.origin );
		this.direction.normalize();

		return this;
	},

	equals: function ( ray ) {

		return ray.origin.equals( this.origin ) && ray.direction.equals( this.direction );

	},

	clone: function () {

		return new THREE.Ray().copy( this );

	}

};

// File:src/math/Sphere.js

/**
 * @author bhouston / http://exocortex.com
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Sphere = function ( center, radius ) {

	this.center = ( center !== undefined ) ? center : new THREE.Vector3();
	this.radius = ( radius !== undefined ) ? radius : 0;

};

THREE.Sphere.prototype = {

	constructor: THREE.Sphere,

	set: function ( center, radius ) {

		this.center.copy( center );
		this.radius = radius;

		return this;
	},

	setFromPoints: function () {

		var box = new THREE.Box3();

		return function ( points, optionalCenter )  {

			var center = this.center;

			if ( optionalCenter !== undefined ) {

				center.copy( optionalCenter );

			} else {

				box.setFromPoints( points ).center( center );

			}

			var maxRadiusSq = 0;

			for ( var i = 0, il = points.length; i < il; i ++ ) {

				maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( points[ i ] ) );

			}

			this.radius = Math.sqrt( maxRadiusSq );

			return this;

 		};

	}(),

	copy: function ( sphere ) {

		this.center.copy( sphere.center );
		this.radius = sphere.radius;

		return this;

	},

	empty: function () {

		return ( this.radius <= 0 );

	},

	containsPoint: function ( point ) {

		return ( point.distanceToSquared( this.center ) <= ( this.radius * this.radius ) );

	},

	distanceToPoint: function ( point ) {

		return ( point.distanceTo( this.center ) - this.radius );

	},

	intersectsSphere: function ( sphere ) {

		var radiusSum = this.radius + sphere.radius;

		return sphere.center.distanceToSquared( this.center ) <= ( radiusSum * radiusSum );

	},

	clampPoint: function ( point, optionalTarget ) {

		var deltaLengthSq = this.center.distanceToSquared( point );

		var result = optionalTarget || new THREE.Vector3();
		result.copy( point );

		if ( deltaLengthSq > ( this.radius * this.radius ) ) {

			result.sub( this.center ).normalize();
			result.multiplyScalar( this.radius ).add( this.center );

		}

		return result;

	},

	getBoundingBox: function ( optionalTarget ) {

		var box = optionalTarget || new THREE.Box3();

		box.set( this.center, this.center );
		box.expandByScalar( this.radius );

		return box;

	},

	applyMatrix4: function ( matrix ) {

		this.center.applyMatrix4( matrix );
		this.radius = this.radius * matrix.getMaxScaleOnAxis();

		return this;

	},

	translate: function ( offset ) {

		this.center.add( offset );

		return this;

	},

	equals: function ( sphere ) {

		return sphere.center.equals( this.center ) && ( sphere.radius === this.radius );

	},

	clone: function () {

		return new THREE.Sphere().copy( this );

	}

};

// File:src/math/Frustum.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author bhouston / http://exocortex.com
 */

THREE.Frustum = function ( p0, p1, p2, p3, p4, p5 ) {

	this.planes = [

		( p0 !== undefined ) ? p0 : new THREE.Plane(),
		( p1 !== undefined ) ? p1 : new THREE.Plane(),
		( p2 !== undefined ) ? p2 : new THREE.Plane(),
		( p3 !== undefined ) ? p3 : new THREE.Plane(),
		( p4 !== undefined ) ? p4 : new THREE.Plane(),
		( p5 !== undefined ) ? p5 : new THREE.Plane()

	];

};

THREE.Frustum.prototype = {

	constructor: THREE.Frustum,

	set: function ( p0, p1, p2, p3, p4, p5 ) {

		var planes = this.planes;

		planes[ 0 ].copy( p0 );
		planes[ 1 ].copy( p1 );
		planes[ 2 ].copy( p2 );
		planes[ 3 ].copy( p3 );
		planes[ 4 ].copy( p4 );
		planes[ 5 ].copy( p5 );

		return this;

	},

	copy: function ( frustum ) {

		var planes = this.planes;

		for ( var i = 0; i < 6; i ++ ) {

			planes[ i ].copy( frustum.planes[ i ] );

		}

		return this;

	},

	setFromMatrix: function ( m ) {

		var planes = this.planes;
		var me = m.elements;
		var me0 = me[ 0 ], me1 = me[ 1 ], me2 = me[ 2 ], me3 = me[ 3 ];
		var me4 = me[ 4 ], me5 = me[ 5 ], me6 = me[ 6 ], me7 = me[ 7 ];
		var me8 = me[ 8 ], me9 = me[ 9 ], me10 = me[ 10 ], me11 = me[ 11 ];
		var me12 = me[ 12 ], me13 = me[ 13 ], me14 = me[ 14 ], me15 = me[ 15 ];

		planes[ 0 ].setComponents( me3 - me0, me7 - me4, me11 - me8, me15 - me12 ).normalize();
		planes[ 1 ].setComponents( me3 + me0, me7 + me4, me11 + me8, me15 + me12 ).normalize();
		planes[ 2 ].setComponents( me3 + me1, me7 + me5, me11 + me9, me15 + me13 ).normalize();
		planes[ 3 ].setComponents( me3 - me1, me7 - me5, me11 - me9, me15 - me13 ).normalize();
		planes[ 4 ].setComponents( me3 - me2, me7 - me6, me11 - me10, me15 - me14 ).normalize();
		planes[ 5 ].setComponents( me3 + me2, me7 + me6, me11 + me10, me15 + me14 ).normalize();

		return this;

	},

	intersectsObject: function () {

		var sphere = new THREE.Sphere();

		return function ( object ) {

			var geometry = object.geometry;

			if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

			sphere.copy( geometry.boundingSphere );
			sphere.applyMatrix4( object.matrixWorld );

			return this.intersectsSphere( sphere );

		};

	}(),

	intersectsSphere: function ( sphere ) {

		var planes = this.planes;
		var center = sphere.center;
		var negRadius = - sphere.radius;

		for ( var i = 0; i < 6; i ++ ) {

			var distance = planes[ i ].distanceToPoint( center );

			if ( distance < negRadius ) {

				return false;

			}

		}

		return true;

	},

	intersectsBox: function () {

		var p1 = new THREE.Vector3(),
			p2 = new THREE.Vector3();

		return function ( box ) {

			var planes = this.planes;

			for ( var i = 0; i < 6 ; i ++ ) {

				var plane = planes[ i ];

				p1.x = plane.normal.x > 0 ? box.min.x : box.max.x;
				p2.x = plane.normal.x > 0 ? box.max.x : box.min.x;
				p1.y = plane.normal.y > 0 ? box.min.y : box.max.y;
				p2.y = plane.normal.y > 0 ? box.max.y : box.min.y;
				p1.z = plane.normal.z > 0 ? box.min.z : box.max.z;
				p2.z = plane.normal.z > 0 ? box.max.z : box.min.z;

				var d1 = plane.distanceToPoint( p1 );
				var d2 = plane.distanceToPoint( p2 );

				// if both outside plane, no intersection

				if ( d1 < 0 && d2 < 0 ) {

					return false;

				}
			}

			return true;
		};

	}(),


	containsPoint: function ( point ) {

		var planes = this.planes;

		for ( var i = 0; i < 6; i ++ ) {

			if ( planes[ i ].distanceToPoint( point ) < 0 ) {

				return false;

			}

		}

		return true;

	},

	clone: function () {

		return new THREE.Frustum().copy( this );

	}

};

// File:src/math/Plane.js

/**
 * @author bhouston / http://exocortex.com
 */

THREE.Plane = function ( normal, constant ) {

	this.normal = ( normal !== undefined ) ? normal : new THREE.Vector3( 1, 0, 0 );
	this.constant = ( constant !== undefined ) ? constant : 0;

};

THREE.Plane.prototype = {

	constructor: THREE.Plane,

	set: function ( normal, constant ) {

		this.normal.copy( normal );
		this.constant = constant;

		return this;

	},

	setComponents: function ( x, y, z, w ) {

		this.normal.set( x, y, z );
		this.constant = w;

		return this;

	},

	setFromNormalAndCoplanarPoint: function ( normal, point ) {

		this.normal.copy( normal );
		this.constant = - point.dot( this.normal );	// must be this.normal, not normal, as this.normal is normalized

		return this;

	},

	setFromCoplanarPoints: function () {

		var v1 = new THREE.Vector3();
		var v2 = new THREE.Vector3();

		return function ( a, b, c ) {

			var normal = v1.subVectors( c, b ).cross( v2.subVectors( a, b ) ).normalize();

			// Q: should an error be thrown if normal is zero (e.g. degenerate plane)?

			this.setFromNormalAndCoplanarPoint( normal, a );

			return this;

		};

	}(),


	copy: function ( plane ) {

		this.normal.copy( plane.normal );
		this.constant = plane.constant;

		return this;

	},

	normalize: function () {

		// Note: will lead to a divide by zero if the plane is invalid.

		var inverseNormalLength = 1.0 / this.normal.length();
		this.normal.multiplyScalar( inverseNormalLength );
		this.constant *= inverseNormalLength;

		return this;

	},

	negate: function () {

		this.constant *= - 1;
		this.normal.negate();

		return this;

	},

	distanceToPoint: function ( point ) {

		return this.normal.dot( point ) + this.constant;

	},

	distanceToSphere: function ( sphere ) {

		return this.distanceToPoint( sphere.center ) - sphere.radius;

	},

	projectPoint: function ( point, optionalTarget ) {

		return this.orthoPoint( point, optionalTarget ).sub( point ).negate();

	},

	orthoPoint: function ( point, optionalTarget ) {

		var perpendicularMagnitude = this.distanceToPoint( point );

		var result = optionalTarget || new THREE.Vector3();
		return result.copy( this.normal ).multiplyScalar( perpendicularMagnitude );

	},

	isIntersectionLine: function ( line ) {

		// Note: this tests if a line intersects the plane, not whether it (or its end-points) are coplanar with it.

		var startSign = this.distanceToPoint( line.start );
		var endSign = this.distanceToPoint( line.end );

		return ( startSign < 0 && endSign > 0 ) || ( endSign < 0 && startSign > 0 );

	},

	intersectLine: function () {

		var v1 = new THREE.Vector3();

		return function ( line, optionalTarget ) {

			var result = optionalTarget || new THREE.Vector3();

			var direction = line.delta( v1 );

			var denominator = this.normal.dot( direction );

			if ( denominator == 0 ) {

				// line is coplanar, return origin
				if ( this.distanceToPoint( line.start ) == 0 ) {

					return result.copy( line.start );

				}

				// Unsure if this is the correct method to handle this case.
				return undefined;

			}

			var t = - ( line.start.dot( this.normal ) + this.constant ) / denominator;

			if ( t < 0 || t > 1 ) {

				return undefined;

			}

			return result.copy( direction ).multiplyScalar( t ).add( line.start );

		};

	}(),


	coplanarPoint: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.copy( this.normal ).multiplyScalar( - this.constant );

	},

	applyMatrix4: function () {

		var v1 = new THREE.Vector3();
		var v2 = new THREE.Vector3();
		var m1 = new THREE.Matrix3();

		return function ( matrix, optionalNormalMatrix ) {

			// compute new normal based on theory here:
			// http://www.songho.ca/opengl/gl_normaltransform.html
			var normalMatrix = optionalNormalMatrix || m1.getNormalMatrix( matrix );
			var newNormal = v1.copy( this.normal ).applyMatrix3( normalMatrix );

			var newCoplanarPoint = this.coplanarPoint( v2 );
			newCoplanarPoint.applyMatrix4( matrix );

			this.setFromNormalAndCoplanarPoint( newNormal, newCoplanarPoint );

			return this;

		};

	}(),

	translate: function ( offset ) {

		this.constant = this.constant - offset.dot( this.normal );

		return this;

	},

	equals: function ( plane ) {

		return plane.normal.equals( this.normal ) && ( plane.constant == this.constant );

	},

	clone: function () {

		return new THREE.Plane().copy( this );

	}

};

// File:src/math/Math.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Math = {

	generateUUID: function () {

		// http://www.broofa.com/Tools/Math.uuid.htm

		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split( '' );
		var uuid = new Array( 36 );
		var rnd = 0, r;

		return function () {

			for ( var i = 0; i < 36; i ++ ) {

				if ( i == 8 || i == 13 || i == 18 || i == 23 ) {

					uuid[ i ] = '-';

				} else if ( i == 14 ) {

					uuid[ i ] = '4';

				} else {

					if ( rnd <= 0x02 ) rnd = 0x2000000 + ( Math.random() * 0x1000000 ) | 0;
					r = rnd & 0xf;
					rnd = rnd >> 4;
					uuid[ i ] = chars[ ( i == 19 ) ? ( r & 0x3 ) | 0x8 : r ];

				}
			}

			return uuid.join( '' );

		};

	}(),

	// Clamp value to range <a, b>

	clamp: function ( x, a, b ) {

		return ( x < a ) ? a : ( ( x > b ) ? b : x );

	},

	// Clamp value to range <a, inf)

	clampBottom: function ( x, a ) {

		return x < a ? a : x;

	},

	// Linear mapping from range <a1, a2> to range <b1, b2>

	mapLinear: function ( x, a1, a2, b1, b2 ) {

		return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );

	},

	// http://en.wikipedia.org/wiki/Smoothstep

	smoothstep: function ( x, min, max ) {

		if ( x <= min ) return 0;
		if ( x >= max ) return 1;

		x = ( x - min ) / ( max - min );

		return x * x * ( 3 - 2 * x );

	},

	smootherstep: function ( x, min, max ) {

		if ( x <= min ) return 0;
		if ( x >= max ) return 1;

		x = ( x - min ) / ( max - min );

		return x * x * x * ( x * ( x * 6 - 15 ) + 10 );

	},

	// Random float from <0, 1> with 16 bits of randomness
	// (standard Math.random() creates repetitive patterns when applied over larger space)

	random16: function () {

		return ( 65280 * Math.random() + 255 * Math.random() ) / 65535;

	},

	// Random integer from <low, high> interval

	randInt: function ( low, high ) {

		return low + Math.floor( Math.random() * ( high - low + 1 ) );

	},

	// Random float from <low, high> interval

	randFloat: function ( low, high ) {

		return low + Math.random() * ( high - low );

	},

	// Random float from <-range/2, range/2> interval

	randFloatSpread: function ( range ) {

		return range * ( 0.5 - Math.random() );

	},

	degToRad: function () {

		var degreeToRadiansFactor = Math.PI / 180;

		return function ( degrees ) {

			return degrees * degreeToRadiansFactor;

		};

	}(),

	radToDeg: function () {

		var radianToDegreesFactor = 180 / Math.PI;

		return function ( radians ) {

			return radians * radianToDegreesFactor;

		};

	}(),

	isPowerOfTwo: function ( value ) {

		return ( value & ( value - 1 ) ) === 0 && value !== 0;

	}

};

// File:src/math/Spline.js

/**
 * Spline from Tween.js, slightly optimized (and trashed)
 * http://sole.github.com/tween.js/examples/05_spline.html
 *
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Spline = function ( points ) {

	this.points = points;

	var c = [], v3 = { x: 0, y: 0, z: 0 },
	point, intPoint, weight, w2, w3,
	pa, pb, pc, pd;

	this.initFromArray = function ( a ) {

		this.points = [];

		for ( var i = 0; i < a.length; i ++ ) {

			this.points[ i ] = { x: a[ i ][ 0 ], y: a[ i ][ 1 ], z: a[ i ][ 2 ] };

		}

	};

	this.getPoint = function ( k ) {

		point = ( this.points.length - 1 ) * k;
		intPoint = Math.floor( point );
		weight = point - intPoint;

		c[ 0 ] = intPoint === 0 ? intPoint : intPoint - 1;
		c[ 1 ] = intPoint;
		c[ 2 ] = intPoint  > this.points.length - 2 ? this.points.length - 1 : intPoint + 1;
		c[ 3 ] = intPoint  > this.points.length - 3 ? this.points.length - 1 : intPoint + 2;

		pa = this.points[ c[ 0 ] ];
		pb = this.points[ c[ 1 ] ];
		pc = this.points[ c[ 2 ] ];
		pd = this.points[ c[ 3 ] ];

		w2 = weight * weight;
		w3 = weight * w2;

		v3.x = interpolate( pa.x, pb.x, pc.x, pd.x, weight, w2, w3 );
		v3.y = interpolate( pa.y, pb.y, pc.y, pd.y, weight, w2, w3 );
		v3.z = interpolate( pa.z, pb.z, pc.z, pd.z, weight, w2, w3 );

		return v3;

	};

	this.getControlPointsArray = function () {

		var i, p, l = this.points.length,
			coords = [];

		for ( i = 0; i < l; i ++ ) {

			p = this.points[ i ];
			coords[ i ] = [ p.x, p.y, p.z ];

		}

		return coords;

	};

	// approximate length by summing linear segments

	this.getLength = function ( nSubDivisions ) {

		var i, index, nSamples, position,
			point = 0, intPoint = 0, oldIntPoint = 0,
			oldPosition = new THREE.Vector3(),
			tmpVec = new THREE.Vector3(),
			chunkLengths = [],
			totalLength = 0;

		// first point has 0 length

		chunkLengths[ 0 ] = 0;

		if ( ! nSubDivisions ) nSubDivisions = 100;

		nSamples = this.points.length * nSubDivisions;

		oldPosition.copy( this.points[ 0 ] );

		for ( i = 1; i < nSamples; i ++ ) {

			index = i / nSamples;

			position = this.getPoint( index );
			tmpVec.copy( position );

			totalLength += tmpVec.distanceTo( oldPosition );

			oldPosition.copy( position );

			point = ( this.points.length - 1 ) * index;
			intPoint = Math.floor( point );

			if ( intPoint != oldIntPoint ) {

				chunkLengths[ intPoint ] = totalLength;
				oldIntPoint = intPoint;

			}

		}

		// last point ends with total length

		chunkLengths[ chunkLengths.length ] = totalLength;

		return { chunks: chunkLengths, total: totalLength };

	};

	this.reparametrizeByArcLength = function ( samplingCoef ) {

		var i, j,
			index, indexCurrent, indexNext,
			linearDistance, realDistance,
			sampling, position,
			newpoints = [],
			tmpVec = new THREE.Vector3(),
			sl = this.getLength();

		newpoints.push( tmpVec.copy( this.points[ 0 ] ).clone() );

		for ( i = 1; i < this.points.length; i ++ ) {

			//tmpVec.copy( this.points[ i - 1 ] );
			//linearDistance = tmpVec.distanceTo( this.points[ i ] );

			realDistance = sl.chunks[ i ] - sl.chunks[ i - 1 ];

			sampling = Math.ceil( samplingCoef * realDistance / sl.total );

			indexCurrent = ( i - 1 ) / ( this.points.length - 1 );
			indexNext = i / ( this.points.length - 1 );

			for ( j = 1; j < sampling - 1; j ++ ) {

				index = indexCurrent + j * ( 1 / sampling ) * ( indexNext - indexCurrent );

				position = this.getPoint( index );
				newpoints.push( tmpVec.copy( position ).clone() );

			}

			newpoints.push( tmpVec.copy( this.points[ i ] ).clone() );

		}

		this.points = newpoints;

	};

	// Catmull-Rom

	function interpolate( p0, p1, p2, p3, t, t2, t3 ) {

		var v0 = ( p2 - p0 ) * 0.5,
			v1 = ( p3 - p1 ) * 0.5;

		return ( 2 * ( p1 - p2 ) + v0 + v1 ) * t3 + ( - 3 * ( p1 - p2 ) - 2 * v0 - v1 ) * t2 + v0 * t + p1;

	};

};

// File:src/math/Triangle.js

/**
 * @author bhouston / http://exocortex.com
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Triangle = function ( a, b, c ) {

	this.a = ( a !== undefined ) ? a : new THREE.Vector3();
	this.b = ( b !== undefined ) ? b : new THREE.Vector3();
	this.c = ( c !== undefined ) ? c : new THREE.Vector3();

};

THREE.Triangle.normal = function () {

	var v0 = new THREE.Vector3();

	return function ( a, b, c, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();

		result.subVectors( c, b );
		v0.subVectors( a, b );
		result.cross( v0 );

		var resultLengthSq = result.lengthSq();
		if ( resultLengthSq > 0 ) {

			return result.multiplyScalar( 1 / Math.sqrt( resultLengthSq ) );

		}

		return result.set( 0, 0, 0 );

	};

}();

// static/instance method to calculate barycoordinates
// based on: http://www.blackpawn.com/texts/pointinpoly/default.html
THREE.Triangle.barycoordFromPoint = function () {

	var v0 = new THREE.Vector3();
	var v1 = new THREE.Vector3();
	var v2 = new THREE.Vector3();

	return function ( point, a, b, c, optionalTarget ) {

		v0.subVectors( c, a );
		v1.subVectors( b, a );
		v2.subVectors( point, a );

		var dot00 = v0.dot( v0 );
		var dot01 = v0.dot( v1 );
		var dot02 = v0.dot( v2 );
		var dot11 = v1.dot( v1 );
		var dot12 = v1.dot( v2 );

		var denom = ( dot00 * dot11 - dot01 * dot01 );

		var result = optionalTarget || new THREE.Vector3();

		// colinear or singular triangle
		if ( denom == 0 ) {
			// arbitrary location outside of triangle?
			// not sure if this is the best idea, maybe should be returning undefined
			return result.set( - 2, - 1, - 1 );
		}

		var invDenom = 1 / denom;
		var u = ( dot11 * dot02 - dot01 * dot12 ) * invDenom;
		var v = ( dot00 * dot12 - dot01 * dot02 ) * invDenom;

		// barycoordinates must always sum to 1
		return result.set( 1 - u - v, v, u );

	};

}();

THREE.Triangle.containsPoint = function () {

	var v1 = new THREE.Vector3();

	return function ( point, a, b, c ) {

		var result = THREE.Triangle.barycoordFromPoint( point, a, b, c, v1 );

		return ( result.x >= 0 ) && ( result.y >= 0 ) && ( ( result.x + result.y ) <= 1 );

	};

}();

THREE.Triangle.prototype = {

	constructor: THREE.Triangle,

	set: function ( a, b, c ) {

		this.a.copy( a );
		this.b.copy( b );
		this.c.copy( c );

		return this;

	},

	setFromPointsAndIndices: function ( points, i0, i1, i2 ) {

		this.a.copy( points[ i0 ] );
		this.b.copy( points[ i1 ] );
		this.c.copy( points[ i2 ] );

		return this;

	},

	copy: function ( triangle ) {

		this.a.copy( triangle.a );
		this.b.copy( triangle.b );
		this.c.copy( triangle.c );

		return this;

	},

	area: function () {

		var v0 = new THREE.Vector3();
		var v1 = new THREE.Vector3();

		return function () {

			v0.subVectors( this.c, this.b );
			v1.subVectors( this.a, this.b );

			return v0.cross( v1 ).length() * 0.5;

		};

	}(),

	midpoint: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.addVectors( this.a, this.b ).add( this.c ).multiplyScalar( 1 / 3 );

	},

	normal: function ( optionalTarget ) {

		return THREE.Triangle.normal( this.a, this.b, this.c, optionalTarget );

	},

	plane: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Plane();

		return result.setFromCoplanarPoints( this.a, this.b, this.c );

	},

	barycoordFromPoint: function ( point, optionalTarget ) {

		return THREE.Triangle.barycoordFromPoint( point, this.a, this.b, this.c, optionalTarget );

	},

	containsPoint: function ( point ) {

		return THREE.Triangle.containsPoint( point, this.a, this.b, this.c );

	},

	equals: function ( triangle ) {

		return triangle.a.equals( this.a ) && triangle.b.equals( this.b ) && triangle.c.equals( this.c );

	},

	clone: function () {

		return new THREE.Triangle().copy( this );

	}

};

// File:src/core/Clock.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Clock = function ( autoStart ) {

	this.autoStart = ( autoStart !== undefined ) ? autoStart : true;

	this.startTime = 0;
	this.oldTime = 0;
	this.elapsedTime = 0;

	this.running = false;

};

THREE.Clock.prototype = {

	constructor: THREE.Clock,

	start: function () {

		this.startTime = self.performance !== undefined && self.performance.now !== undefined
					 ? self.performance.now()
					 : Date.now();

		this.oldTime = this.startTime;
		this.running = true;
	},

	stop: function () {

		this.getElapsedTime();
		this.running = false;

	},

	getElapsedTime: function () {

		this.getDelta();
		return this.elapsedTime;

	},

	getDelta: function () {

		var diff = 0;

		if ( this.autoStart && ! this.running ) {

			this.start();

		}

		if ( this.running ) {

			var newTime = self.performance !== undefined && self.performance.now !== undefined
					 ? self.performance.now()
					 : Date.now();

			diff = 0.001 * ( newTime - this.oldTime );
			this.oldTime = newTime;

			this.elapsedTime += diff;

		}

		return diff;

	}

};

// File:src/core/EventDispatcher.js

/**
 * https://github.com/mrdoob/eventdispatcher.js/
 */

THREE.EventDispatcher = function () {}

THREE.EventDispatcher.prototype = {

	constructor: THREE.EventDispatcher,

	apply: function ( object ) {

		object.addEventListener = THREE.EventDispatcher.prototype.addEventListener;
		object.hasEventListener = THREE.EventDispatcher.prototype.hasEventListener;
		object.removeEventListener = THREE.EventDispatcher.prototype.removeEventListener;
		object.dispatchEvent = THREE.EventDispatcher.prototype.dispatchEvent;

	},

	addEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) this._listeners = {};

		var listeners = this._listeners;

		if ( listeners[ type ] === undefined ) {

			listeners[ type ] = [];

		}

		if ( listeners[ type ].indexOf( listener ) === - 1 ) {

			listeners[ type ].push( listener );

		}

	},

	hasEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) return false;

		var listeners = this._listeners;

		if ( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1 ) {

			return true;

		}

		return false;

	},

	removeEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var listenerArray = listeners[ type ];

		if ( listenerArray !== undefined ) {

			var index = listenerArray.indexOf( listener );

			if ( index !== - 1 ) {

				listenerArray.splice( index, 1 );

			}

		}

	},

	dispatchEvent: function ( event ) {

		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var listenerArray = listeners[ event.type ];

		if ( listenerArray !== undefined ) {

			event.target = this;

			var array = [];
			var length = listenerArray.length;

			for ( var i = 0; i < length; i ++ ) {

				array[ i ] = listenerArray[ i ];

			}

			for ( var i = 0; i < length; i ++ ) {

				array[ i ].call( this, event );

			}

		}

	}

};

// File:src/core/Raycaster.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author bhouston / http://exocortex.com/
 * @author stephomi / http://stephaneginier.com/
 */

( function ( THREE ) {

	THREE.Raycaster = function ( origin, direction, near, far ) {

		this.ray = new THREE.Ray( origin, direction );
		// direction is assumed to be normalized (for accurate distance calculations)

		this.near = near || 0;
		this.far = far || Infinity;

		this.params = {
			Sprite: {},
			Mesh: {},
			PointCloud: { threshold: 1 },
			LOD: {},
			Line: {}
		};

	};

	var descSort = function ( a, b ) {

		return a.distance - b.distance;

	};

	var intersectObject = function ( object, raycaster, intersects, recursive ) {

		object.raycast( raycaster, intersects );

		if ( recursive === true ) {

			var children = object.children;

			for ( var i = 0, l = children.length; i < l; i ++ ) {

				intersectObject( children[ i ], raycaster, intersects, true );

			}

		}

	};

	//

	THREE.Raycaster.prototype = {

		constructor: THREE.Raycaster,

		precision: 0.0001,
		linePrecision: 1,

		set: function ( origin, direction ) {

			this.ray.set( origin, direction );
			// direction is assumed to be normalized (for accurate distance calculations)

		},

		intersectObject: function ( object, recursive ) {

			var intersects = [];

			intersectObject( object, this, intersects, recursive );

			intersects.sort( descSort );

			return intersects;

		},

		intersectObjects: function ( objects, recursive ) {

			var intersects = [];

			if ( objects instanceof Array === false ) {

				console.log( 'THREE.Raycaster.intersectObjects: objects is not an Array.' );
				return intersects;

			}

			for ( var i = 0, l = objects.length; i < l; i ++ ) {

				intersectObject( objects[ i ], this, intersects, recursive );

			}

			intersects.sort( descSort );

			return intersects;

		}

	};

}( THREE ) );

// File:src/core/Object3D.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.Object3D = function () {

	Object.defineProperty( this, 'id', { value: THREE.Object3DIdCount ++ } );

	this.uuid = THREE.Math.generateUUID();

	this.name = '';
	this.type = 'Object3D';

	this.parent = undefined;
	this.children = [];

	this.up = THREE.Object3D.DefaultUp.clone();

	var scope = this;

	var position = new THREE.Vector3();
	var rotation = new THREE.Euler();
	var quaternion = new THREE.Quaternion();
	var scale = new THREE.Vector3( 1, 1, 1 );

	var onRotationChange = function () {
		quaternion.setFromEuler( rotation, false );
	};

	var onQuaternionChange = function () {
		rotation.setFromQuaternion( quaternion, undefined, false );
	};

	rotation.onChange( onRotationChange );
	quaternion.onChange( onQuaternionChange );

	Object.defineProperties( this, {
		position: {
			enumerable: true,
			value: position
		},
		rotation: {
			enumerable: true,
			value: rotation
		},
		quaternion: {
			enumerable: true,
			value: quaternion
		},
		scale: {
			enumerable: true,
			value: scale
		},
	} );

	this.renderDepth = null;

	this.rotationAutoUpdate = true;

	this.matrix = new THREE.Matrix4();
	this.matrixWorld = new THREE.Matrix4();

	this.matrixAutoUpdate = true;
	this.matrixWorldNeedsUpdate = false;

	this.visible = true;

	this.castShadow = false;
	this.receiveShadow = false;

	this.frustumCulled = true;

	this.userData = {};

};

THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 1, 0 );

THREE.Object3D.prototype = {

	constructor: THREE.Object3D,

	get eulerOrder () {

		console.warn( 'THREE.Object3D: .eulerOrder has been moved to .rotation.order.' );

		return this.rotation.order;

	},

	set eulerOrder ( value ) {

		console.warn( 'THREE.Object3D: .eulerOrder has been moved to .rotation.order.' );

		this.rotation.order = value;

	},

	get useQuaternion () {

		console.warn( 'THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.' );

	},

	set useQuaternion ( value ) {

		console.warn( 'THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.' );

	},

	applyMatrix: function ( matrix ) {

		this.matrix.multiplyMatrices( matrix, this.matrix );

		this.matrix.decompose( this.position, this.quaternion, this.scale );

	},

	setRotationFromAxisAngle: function ( axis, angle ) {

		// assumes axis is normalized

		this.quaternion.setFromAxisAngle( axis, angle );

	},

	setRotationFromEuler: function ( euler ) {

		this.quaternion.setFromEuler( euler, true );

	},

	setRotationFromMatrix: function ( m ) {

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		this.quaternion.setFromRotationMatrix( m );

	},

	setRotationFromQuaternion: function ( q ) {

		// assumes q is normalized

		this.quaternion.copy( q );

	},

	rotateOnAxis: function () {

		// rotate object on axis in object space
		// axis is assumed to be normalized

		var q1 = new THREE.Quaternion();

		return function ( axis, angle ) {

			q1.setFromAxisAngle( axis, angle );

			this.quaternion.multiply( q1 );

			return this;

		}

	}(),

	rotateX: function () {

		var v1 = new THREE.Vector3( 1, 0, 0 );

		return function ( angle ) {

			return this.rotateOnAxis( v1, angle );

		};

	}(),

	rotateY: function () {

		var v1 = new THREE.Vector3( 0, 1, 0 );

		return function ( angle ) {

			return this.rotateOnAxis( v1, angle );

		};

	}(),

	rotateZ: function () {

		var v1 = new THREE.Vector3( 0, 0, 1 );

		return function ( angle ) {

			return this.rotateOnAxis( v1, angle );

		};

	}(),

	translateOnAxis: function () {

		// translate object by distance along axis in object space
		// axis is assumed to be normalized

		var v1 = new THREE.Vector3();

		return function ( axis, distance ) {

			v1.copy( axis ).applyQuaternion( this.quaternion );

			this.position.add( v1.multiplyScalar( distance ) );

			return this;

		}

	}(),

	translate: function ( distance, axis ) {

		console.warn( 'THREE.Object3D: .translate() has been removed. Use .translateOnAxis( axis, distance ) instead.' );
		return this.translateOnAxis( axis, distance );

	},

	translateX: function () {

		var v1 = new THREE.Vector3( 1, 0, 0 );

		return function ( distance ) {

			return this.translateOnAxis( v1, distance );

		};

	}(),

	translateY: function () {

		var v1 = new THREE.Vector3( 0, 1, 0 );

		return function ( distance ) {

			return this.translateOnAxis( v1, distance );

		};

	}(),

	translateZ: function () {

		var v1 = new THREE.Vector3( 0, 0, 1 );

		return function ( distance ) {

			return this.translateOnAxis( v1, distance );

		};

	}(),

	localToWorld: function ( vector ) {

		return vector.applyMatrix4( this.matrixWorld );

	},

	worldToLocal: function () {

		var m1 = new THREE.Matrix4();

		return function ( vector ) {

			return vector.applyMatrix4( m1.getInverse( this.matrixWorld ) );

		};

	}(),

	lookAt: function () {

		// This routine does not support objects with rotated and/or translated parent(s)

		var m1 = new THREE.Matrix4();

		return function ( vector ) {

			m1.lookAt( vector, this.position, this.up );

			this.quaternion.setFromRotationMatrix( m1 );

		};

	}(),

	add: function ( object ) {

		if ( arguments.length > 1 ) {

			for ( var i = 0; i < arguments.length; i++ ) {

				this.add( arguments[ i ] );

			}

			return this;

		};

		if ( object === this ) {

			console.error( "THREE.Object3D.add:", object, "can't be added as a child of itself." );
			return this;

		}

		if ( object instanceof THREE.Object3D ) {

			if ( object.parent !== undefined ) {

				object.parent.remove( object );

			}

			object.parent = this;
			object.dispatchEvent( { type: 'added' } );

			this.children.push( object );

		} else {

			console.error( "THREE.Object3D.add:", object, "is not an instance of THREE.Object3D." );

		}

		return this;

	},

	remove: function ( object ) {

		if ( arguments.length > 1 ) {

			for ( var i = 0; i < arguments.length; i++ ) {

				this.remove( arguments[ i ] );

			}

		};

		var index = this.children.indexOf( object );

		if ( index !== - 1 ) {

			object.parent = undefined;

			object.dispatchEvent( { type: 'removed' } );

			this.children.splice( index, 1 );

		}

	},

	getChildByName: function ( name, recursive ) {

		console.warn( 'THREE.Object3D: .getChildByName() has been renamed to .getObjectByName().' );
		return this.getObjectByName( name, recursive );

	},

	getObjectById: function ( id, recursive ) {

		if ( this.id === id ) return this;

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			var child = this.children[ i ];
			var object = child.getObjectById( id, recursive );

			if ( object !== undefined ) {

				return object;

			}

		}

		return undefined;

	},

	getObjectByName: function ( name, recursive ) {

		if ( this.name === name ) return this;

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			var child = this.children[ i ];
			var object = child.getObjectByName( name, recursive );

			if ( object !== undefined ) {

				return object;

			}

		}

		return undefined;

	},

	getWorldPosition: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();

		this.updateMatrixWorld( true );

		return result.setFromMatrixPosition( this.matrixWorld );

	},

	getWorldQuaternion: function () {

		var position = new THREE.Vector3();
		var scale = new THREE.Vector3();

		return function ( optionalTarget ) {

			var result = optionalTarget || new THREE.Quaternion();

			this.updateMatrixWorld( true );

			this.matrixWorld.decompose( position, result, scale );

			return result;

		}

	}(),

	getWorldRotation: function () {

		var quaternion = new THREE.Quaternion();

		return function ( optionalTarget ) {

			var result = optionalTarget || new THREE.Euler();

			this.getWorldQuaternion( quaternion );

			return result.setFromQuaternion( quaternion, this.rotation.order, false );

		}

	}(),

	getWorldScale: function () {

		var position = new THREE.Vector3();
		var quaternion = new THREE.Quaternion();

		return function ( optionalTarget ) {

			var result = optionalTarget || new THREE.Vector3();

			this.updateMatrixWorld( true );

			this.matrixWorld.decompose( position, quaternion, result );

			return result;

		}

	}(),

	getWorldDirection: function () {

		var quaternion = new THREE.Quaternion();

		return function ( optionalTarget ) {

			var result = optionalTarget || new THREE.Vector3();

			this.getWorldQuaternion( quaternion );

			return result.set( 0, 0, 1 ).applyQuaternion( quaternion );

		}

	}(),

	raycast: function () {},

	traverse: function ( callback ) {

		callback( this );

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			this.children[ i ].traverse( callback );

		}

	},

	traverseVisible: function ( callback ) {

		if ( this.visible === false ) return;

		callback( this );

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			this.children[ i ].traverseVisible( callback );

		}

	},

	updateMatrix: function () {

		this.matrix.compose( this.position, this.quaternion, this.scale );

		this.matrixWorldNeedsUpdate = true;

	},

	updateMatrixWorld: function ( force ) {

		if ( this.matrixAutoUpdate === true ) this.updateMatrix();

		if ( this.matrixWorldNeedsUpdate === true || force === true ) {

			if ( this.parent === undefined ) {

				this.matrixWorld.copy( this.matrix );

			} else {

				this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );

			}

			this.matrixWorldNeedsUpdate = false;

			force = true;

		}

		// update children

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			this.children[ i ].updateMatrixWorld( force );

		}

	},

	toJSON: function () {

		var output = {
			metadata: {
				version: 4.3,
				type: 'Object',
				generator: 'ObjectExporter'
			}
		};

		//

		var geometries = {};

		var parseGeometry = function ( geometry ) {

			if ( output.geometries === undefined ) {

				output.geometries = [];

			}

			if ( geometries[ geometry.uuid ] === undefined ) {

				var json = geometry.toJSON();

				delete json.metadata;

				geometries[ geometry.uuid ] = json;

				output.geometries.push( json );

			}

			return geometry.uuid;

		};

		//

		var materials = {};

		var parseMaterial = function ( material ) {

			if ( output.materials === undefined ) {

				output.materials = [];

			}

			if ( materials[ material.uuid ] === undefined ) {

				var json = material.toJSON();

				delete json.metadata;

				materials[ material.uuid ] = json;

				output.materials.push( json );

			}

			return material.uuid;

		};

		//

		var parseObject = function ( object ) {

			var data = {};

			data.uuid = object.uuid;
			data.type = object.type;

			if ( object.name !== '' ) data.name = object.name;
			if ( JSON.stringify( object.userData ) !== '{}' ) data.userData = object.userData;
			if ( object.visible !== true ) data.visible = object.visible;

			if ( object instanceof THREE.PerspectiveCamera ) {

				data.fov = object.fov;
				data.aspect = object.aspect;
				data.near = object.near;
				data.far = object.far;

			} else if ( object instanceof THREE.OrthographicCamera ) {

				data.left = object.left;
				data.right = object.right;
				data.top = object.top;
				data.bottom = object.bottom;
				data.near = object.near;
				data.far = object.far;

			} else if ( object instanceof THREE.AmbientLight ) {

				data.color = object.color.getHex();

			} else if ( object instanceof THREE.DirectionalLight ) {

				data.color = object.color.getHex();
				data.intensity = object.intensity;

			} else if ( object instanceof THREE.PointLight ) {

				data.color = object.color.getHex();
				data.intensity = object.intensity;
				data.distance = object.distance;

			} else if ( object instanceof THREE.SpotLight ) {

				data.color = object.color.getHex();
				data.intensity = object.intensity;
				data.distance = object.distance;
				data.angle = object.angle;
				data.exponent = object.exponent;

			} else if ( object instanceof THREE.HemisphereLight ) {

				data.color = object.color.getHex();
				data.groundColor = object.groundColor.getHex();

			} else if ( object instanceof THREE.Mesh ) {

				data.geometry = parseGeometry( object.geometry );
				data.material = parseMaterial( object.material );

			} else if ( object instanceof THREE.Line ) {

				data.geometry = parseGeometry( object.geometry );
				data.material = parseMaterial( object.material );

			} else if ( object instanceof THREE.Sprite ) {

				data.material = parseMaterial( object.material );

			}

			data.matrix = object.matrix.toArray();

			if ( object.children.length > 0 ) {

				data.children = [];

				for ( var i = 0; i < object.children.length; i ++ ) {

					data.children.push( parseObject( object.children[ i ] ) );

				}

			}

			return data;

		}

		output.object = parseObject( this );

		return output;

	},

	clone: function ( object, recursive ) {

		if ( object === undefined ) object = new THREE.Object3D();
		if ( recursive === undefined ) recursive = true;

		object.name = this.name;

		object.up.copy( this.up );

		object.position.copy( this.position );
		object.quaternion.copy( this.quaternion );
		object.scale.copy( this.scale );

		object.renderDepth = this.renderDepth;

		object.rotationAutoUpdate = this.rotationAutoUpdate;

		object.matrix.copy( this.matrix );
		object.matrixWorld.copy( this.matrixWorld );

		object.matrixAutoUpdate = this.matrixAutoUpdate;
		object.matrixWorldNeedsUpdate = this.matrixWorldNeedsUpdate;

		object.visible = this.visible;

		object.castShadow = this.castShadow;
		object.receiveShadow = this.receiveShadow;

		object.frustumCulled = this.frustumCulled;

		object.userData = JSON.parse( JSON.stringify( this.userData ) );

		if ( recursive === true ) {

			for ( var i = 0; i < this.children.length; i ++ ) {

				var child = this.children[ i ];
				object.add( child.clone() );

			}

		}

		return object;

	}

};

THREE.EventDispatcher.prototype.apply( THREE.Object3D.prototype );

THREE.Object3DIdCount = 0;

// File:src/core/Projector.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Projector = function () {

	console.warn( 'THREE.Projector has been moved to /examples/renderers/Projector.js.' );

	this.projectVector = function ( vector, camera ) {

		console.warn( 'THREE.Projector: .projectVector() is now vector.project().' );
		vector.project( camera );

	};

	this.unprojectVector = function ( vector, camera ) {

		console.warn( 'THREE.Projector: .unprojectVector() is now vector.unproject().' );
		vector.unproject( camera );

	};

	this.pickingRay = function ( vector, camera ) {

		console.error( 'THREE.Projector: .pickingRay() has been removed.' );

	};

};

// File:src/core/Face3.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Face3 = function ( a, b, c, normal, color, materialIndex ) {

	this.a = a;
	this.b = b;
	this.c = c;

	this.normal = normal instanceof THREE.Vector3 ? normal : new THREE.Vector3();
	this.vertexNormals = normal instanceof Array ? normal : [];

	this.color = color instanceof THREE.Color ? color : new THREE.Color();
	this.vertexColors = color instanceof Array ? color : [];

	this.vertexTangents = [];

	this.materialIndex = materialIndex !== undefined ? materialIndex : 0;

};

THREE.Face3.prototype = {

	constructor: THREE.Face3,

	clone: function () {

		var face = new THREE.Face3( this.a, this.b, this.c );

		face.normal.copy( this.normal );
		face.color.copy( this.color );

		face.materialIndex = this.materialIndex;

		for ( var i = 0, il = this.vertexNormals.length; i < il; i ++ ) {

			face.vertexNormals[ i ] = this.vertexNormals[ i ].clone();

		}

		for ( var i = 0, il = this.vertexColors.length; i < il; i ++ ) {

			face.vertexColors[ i ] = this.vertexColors[ i ].clone();

		}

		for ( var i = 0, il = this.vertexTangents.length; i < il; i ++ ) {

			face.vertexTangents[ i ] = this.vertexTangents[ i ].clone();

		}

		return face;

	}

};

// File:src/core/Face4.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Face4 = function ( a, b, c, d, normal, color, materialIndex ) {

	console.warn( 'THREE.Face4 has been removed. A THREE.Face3 will be created instead.' )
	return new THREE.Face3( a, b, c, normal, color, materialIndex );

};

// File:src/core/BufferAttribute.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.BufferAttribute = function ( array, itemSize ) {

	this.array = array;
	this.itemSize = itemSize;

	this.needsUpdate = false;

};

THREE.BufferAttribute.prototype = {

	constructor: THREE.BufferAttribute,

	get length () {

		return this.array.length;

	},

	copyAt: function ( index1, attribute, index2 ) {

		index1 *= this.itemSize;
		index2 *= attribute.itemSize;

		for ( var i = 0, l = this.itemSize; i < l; i ++ ) {

			this.array[ index1 + i ] = attribute.array[ index2 + i ];

		}

	},

	set: function ( value ) {

		this.array.set( value );

		return this;

	},

	setX: function ( index, x ) {

		this.array[ index * this.itemSize ] = x;

		return this;

	},

	setY: function ( index, y ) {

		this.array[ index * this.itemSize + 1 ] = y;

		return this;

	},

	setZ: function ( index, z ) {

		this.array[ index * this.itemSize + 2 ] = z;

		return this;

	},

	setXY: function ( index, x, y ) {

		index *= this.itemSize;

		this.array[ index     ] = x;
		this.array[ index + 1 ] = y;

		return this;

	},

	setXYZ: function ( index, x, y, z ) {

		index *= this.itemSize;

		this.array[ index     ] = x;
		this.array[ index + 1 ] = y;
		this.array[ index + 2 ] = z;

		return this;

	},

	setXYZW: function ( index, x, y, z, w ) {

		index *= this.itemSize;

		this.array[ index     ] = x;
		this.array[ index + 1 ] = y;
		this.array[ index + 2 ] = z;
		this.array[ index + 3 ] = w;

		return this;

	},

	clone: function () {

		return new THREE.BufferAttribute( new this.array.constructor( this.array ), this.itemSize );

	}

};

//

THREE.Int8Attribute = function ( data, itemSize ) {

	console.warn( 'THREE.Int8Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead.' );
	return new THREE.BufferAttribute( data, itemSize );

};

THREE.Uint8Attribute = function ( data, itemSize ) {

	console.warn( 'THREE.Uint8Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead.' );
	return new THREE.BufferAttribute( data, itemSize );

};

THREE.Uint8ClampedAttribute = function ( data, itemSize ) {

	console.warn( 'THREE.Uint8ClampedAttribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead.' );
	return new THREE.BufferAttribute( data, itemSize );


};

THREE.Int16Attribute = function ( data, itemSize ) {

	console.warn( 'THREE.Int16Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead.' );
	return new THREE.BufferAttribute( data, itemSize );

};

THREE.Uint16Attribute = function ( data, itemSize ) {

	console.warn( 'THREE.Uint16Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead.' );
	return new THREE.BufferAttribute( data, itemSize );

};

THREE.Int32Attribute = function ( data, itemSize ) {

	console.warn( 'THREE.Int32Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead.' );
	return new THREE.BufferAttribute( data, itemSize );

};

THREE.Uint32Attribute = function ( data, itemSize ) {

	console.warn( 'THREE.Uint32Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead.' );
	return new THREE.BufferAttribute( data, itemSize );

};

THREE.Float32Attribute = function ( data, itemSize ) {

	console.warn( 'THREE.Float32Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead.' );
	return new THREE.BufferAttribute( data, itemSize );

};

THREE.Float64Attribute = function ( data, itemSize ) {

	console.warn( 'THREE.Float64Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead.' );
	return new THREE.BufferAttribute( data, itemSize );

};

// File:src/core/BufferGeometry.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.BufferGeometry = function () {

	Object.defineProperty( this, 'id', { value: THREE.GeometryIdCount ++ } );

	this.uuid = THREE.Math.generateUUID();

	this.name = '';
	this.type = 'BufferGeometry';

	this.attributes = {};
	this.attributesKeys = [];

	this.drawcalls = [];
	this.offsets = this.drawcalls; // backwards compatibility

	this.boundingBox = null;
	this.boundingSphere = null;

};

THREE.BufferGeometry.prototype = {

	constructor: THREE.BufferGeometry,

	addAttribute: function ( name, attribute ) {

		if ( attribute instanceof THREE.BufferAttribute === false ) {

			console.warn( 'THREE.BufferGeometry: .addAttribute() now expects ( name, attribute ).' );

			this.attributes[ name ] = { array: arguments[ 1 ], itemSize: arguments[ 2 ] };

			return;

		}

		this.attributes[ name ] = attribute;
		this.attributesKeys = Object.keys( this.attributes );

	},

	getAttribute: function ( name ) {

		return this.attributes[ name ];

	},

	addDrawCall: function ( start, count, indexOffset ) {

		this.drawcalls.push( {

			start: start,
			count: count,
			index: indexOffset !== undefined ? indexOffset : 0

		} );

	},

	applyMatrix: function ( matrix ) {

		var position = this.attributes.position;

		if ( position !== undefined ) {

			matrix.applyToVector3Array( position.array );
			position.needsUpdate = true;

		}

		var normal = this.attributes.normal;

		if ( normal !== undefined ) {

			var normalMatrix = new THREE.Matrix3().getNormalMatrix( matrix );

			normalMatrix.applyToVector3Array( normal.array );
			normal.needsUpdate = true;

		}

	},

	center: function () {

		// TODO

	},

	fromGeometry: function ( geometry, settings ) {

		settings = settings || { 'vertexColors': THREE.NoColors };

		var vertices = geometry.vertices;
		var faces = geometry.faces;
		var faceVertexUvs = geometry.faceVertexUvs;
		var vertexColors = settings.vertexColors;
		var hasFaceVertexUv = faceVertexUvs[ 0 ].length > 0;
		var hasFaceVertexNormals = faces[ 0 ].vertexNormals.length == 3;

		var positions = new Float32Array( faces.length * 3 * 3 );
		this.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

		var normals = new Float32Array( faces.length * 3 * 3 );
		this.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );

		if ( vertexColors !== THREE.NoColors ) {

			var colors = new Float32Array( faces.length * 3 * 3 );
			this.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

		}

		if ( hasFaceVertexUv === true ) {

			var uvs = new Float32Array( faces.length * 3 * 2 );
			this.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

		}

		for ( var i = 0, i2 = 0, i3 = 0; i < faces.length; i ++, i2 += 6, i3 += 9 ) {

			var face = faces[ i ];

			var a = vertices[ face.a ];
			var b = vertices[ face.b ];
			var c = vertices[ face.c ];

			positions[ i3     ] = a.x;
			positions[ i3 + 1 ] = a.y;
			positions[ i3 + 2 ] = a.z;

			positions[ i3 + 3 ] = b.x;
			positions[ i3 + 4 ] = b.y;
			positions[ i3 + 5 ] = b.z;

			positions[ i3 + 6 ] = c.x;
			positions[ i3 + 7 ] = c.y;
			positions[ i3 + 8 ] = c.z;

			if ( hasFaceVertexNormals === true ) {

				var na = face.vertexNormals[ 0 ];
				var nb = face.vertexNormals[ 1 ];
				var nc = face.vertexNormals[ 2 ];

				normals[ i3     ] = na.x;
				normals[ i3 + 1 ] = na.y;
				normals[ i3 + 2 ] = na.z;

				normals[ i3 + 3 ] = nb.x;
				normals[ i3 + 4 ] = nb.y;
				normals[ i3 + 5 ] = nb.z;

				normals[ i3 + 6 ] = nc.x;
				normals[ i3 + 7 ] = nc.y;
				normals[ i3 + 8 ] = nc.z;

			} else {

				var n = face.normal;

				normals[ i3     ] = n.x;
				normals[ i3 + 1 ] = n.y;
				normals[ i3 + 2 ] = n.z;

				normals[ i3 + 3 ] = n.x;
				normals[ i3 + 4 ] = n.y;
				normals[ i3 + 5 ] = n.z;

				normals[ i3 + 6 ] = n.x;
				normals[ i3 + 7 ] = n.y;
				normals[ i3 + 8 ] = n.z;

			}

			if ( vertexColors === THREE.FaceColors ) {

				var fc = face.color;

				colors[ i3     ] = fc.r;
				colors[ i3 + 1 ] = fc.g;
				colors[ i3 + 2 ] = fc.b;

				colors[ i3 + 3 ] = fc.r;
				colors[ i3 + 4 ] = fc.g;
				colors[ i3 + 5 ] = fc.b;

				colors[ i3 + 6 ] = fc.r;
				colors[ i3 + 7 ] = fc.g;
				colors[ i3 + 8 ] = fc.b;

			} else if ( vertexColors === THREE.VertexColors ) {

				var vca = face.vertexColors[ 0 ];
				var vcb = face.vertexColors[ 1 ];
				var vcc = face.vertexColors[ 2 ];

				colors[ i3     ] = vca.r;
				colors[ i3 + 1 ] = vca.g;
				colors[ i3 + 2 ] = vca.b;

				colors[ i3 + 3 ] = vcb.r;
				colors[ i3 + 4 ] = vcb.g;
				colors[ i3 + 5 ] = vcb.b;

				colors[ i3 + 6 ] = vcc.r;
				colors[ i3 + 7 ] = vcc.g;
				colors[ i3 + 8 ] = vcc.b;

			}

			if ( hasFaceVertexUv === true ) {

				var uva = faceVertexUvs[ 0 ][ i ][ 0 ];
				var uvb = faceVertexUvs[ 0 ][ i ][ 1 ];
				var uvc = faceVertexUvs[ 0 ][ i ][ 2 ];

				uvs[ i2     ] = uva.x;
				uvs[ i2 + 1 ] = uva.y;

				uvs[ i2 + 2 ] = uvb.x;
				uvs[ i2 + 3 ] = uvb.y;

				uvs[ i2 + 4 ] = uvc.x;
				uvs[ i2 + 5 ] = uvc.y;

			}

		}

		this.computeBoundingSphere()

		return this;

	},

	computeBoundingBox: function () {

		var vector = new THREE.Vector3();

		return function () {

			if ( this.boundingBox === null ) {

				this.boundingBox = new THREE.Box3();

			}

			var positions = this.attributes.position.array;

			if ( positions ) {

				var bb = this.boundingBox;
				bb.makeEmpty();

				for ( var i = 0, il = positions.length; i < il; i += 3 ) {

					vector.set( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] );
					bb.expandByPoint( vector );

				}

			}

			if ( positions === undefined || positions.length === 0 ) {

				this.boundingBox.min.set( 0, 0, 0 );
				this.boundingBox.max.set( 0, 0, 0 );

			}

			if ( isNaN( this.boundingBox.min.x ) || isNaN( this.boundingBox.min.y ) || isNaN( this.boundingBox.min.z ) ) {

				console.error( 'THREE.BufferGeometry.computeBoundingBox: Computed min/max have NaN values. The "position" attribute is likely to have NaN values.' );

			}

		}

	}(),

	computeBoundingSphere: function () {

		var box = new THREE.Box3();
		var vector = new THREE.Vector3();

		return function () {

			if ( this.boundingSphere === null ) {

				this.boundingSphere = new THREE.Sphere();

			}

			var positions = this.attributes.position.array;

			if ( positions ) {

				box.makeEmpty();

				var center = this.boundingSphere.center;

				for ( var i = 0, il = positions.length; i < il; i += 3 ) {

					vector.set( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] );
					box.expandByPoint( vector );

				}

				box.center( center );

				// hoping to find a boundingSphere with a radius smaller than the
				// boundingSphere of the boundingBox:  sqrt(3) smaller in the best case

				var maxRadiusSq = 0;

				for ( var i = 0, il = positions.length; i < il; i += 3 ) {

					vector.set( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] );
					maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( vector ) );

				}

				this.boundingSphere.radius = Math.sqrt( maxRadiusSq );

				if ( isNaN( this.boundingSphere.radius ) ) {

					console.error( 'THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.' );

				}

			}

		}

	}(),

	computeFaceNormals: function () {

		// backwards compatibility

	},

	computeVertexNormals: function () {

		var attributes = this.attributes;

		if ( attributes.position ) {

			var positions = attributes.position.array;

			if ( attributes.normal === undefined ) {

				this.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( positions.length ), 3 ) );

			} else {

				// reset existing normals to zero

				var normals = attributes.normal.array;

				for ( var i = 0, il = normals.length; i < il; i ++ ) {

					normals[ i ] = 0;

				}

			}

			var normals = attributes.normal.array;

			var vA, vB, vC,

			pA = new THREE.Vector3(),
			pB = new THREE.Vector3(),
			pC = new THREE.Vector3(),

			cb = new THREE.Vector3(),
			ab = new THREE.Vector3();

			// indexed elements

			if ( attributes.index ) {

				var indices = attributes.index.array;

				var offsets = ( this.offsets.length > 0 ? this.offsets : [ { start: 0, count: indices.length, index: 0 } ] );

				for ( var j = 0, jl = offsets.length; j < jl; ++ j ) {

					var start = offsets[ j ].start;
					var count = offsets[ j ].count;
					var index = offsets[ j ].index;

					for ( var i = start, il = start + count; i < il; i += 3 ) {

						vA = ( index + indices[ i     ] ) * 3;
						vB = ( index + indices[ i + 1 ] ) * 3;
						vC = ( index + indices[ i + 2 ] ) * 3;

						pA.fromArray( positions, vA );
						pB.fromArray( positions, vB );
						pC.fromArray( positions, vC );

						cb.subVectors( pC, pB );
						ab.subVectors( pA, pB );
						cb.cross( ab );

						normals[ vA     ] += cb.x;
						normals[ vA + 1 ] += cb.y;
						normals[ vA + 2 ] += cb.z;

						normals[ vB     ] += cb.x;
						normals[ vB + 1 ] += cb.y;
						normals[ vB + 2 ] += cb.z;

						normals[ vC     ] += cb.x;
						normals[ vC + 1 ] += cb.y;
						normals[ vC + 2 ] += cb.z;

					}

				}

			} else {

				// non-indexed elements (unconnected triangle soup)

				for ( var i = 0, il = positions.length; i < il; i += 9 ) {

					pA.fromArray( positions, i );
					pB.fromArray( positions, i + 3 );
					pC.fromArray( positions, i + 6 );

					cb.subVectors( pC, pB );
					ab.subVectors( pA, pB );
					cb.cross( ab );

					normals[ i     ] = cb.x;
					normals[ i + 1 ] = cb.y;
					normals[ i + 2 ] = cb.z;

					normals[ i + 3 ] = cb.x;
					normals[ i + 4 ] = cb.y;
					normals[ i + 5 ] = cb.z;

					normals[ i + 6 ] = cb.x;
					normals[ i + 7 ] = cb.y;
					normals[ i + 8 ] = cb.z;

				}

			}

			this.normalizeNormals();

			attributes.normal.needsUpdate = true;

		}

	},

	computeTangents: function () {

		// based on http://www.terathon.com/code/tangent.html
		// (per vertex tangents)

		if ( this.attributes.index === undefined ||
			 this.attributes.position === undefined ||
			 this.attributes.normal === undefined ||
			 this.attributes.uv === undefined ) {

			console.warn( 'Missing required attributes (index, position, normal or uv) in BufferGeometry.computeTangents()' );
			return;

		}

		var indices = this.attributes.index.array;
		var positions = this.attributes.position.array;
		var normals = this.attributes.normal.array;
		var uvs = this.attributes.uv.array;

		var nVertices = positions.length / 3;

		if ( this.attributes.tangent === undefined ) {

			this.addAttribute( 'tangent', new THREE.BufferAttribute( new Float32Array( 4 * nVertices ), 4 ) );

		}

		var tangents = this.attributes.tangent.array;

		var tan1 = [], tan2 = [];

		for ( var k = 0; k < nVertices; k ++ ) {

			tan1[ k ] = new THREE.Vector3();
			tan2[ k ] = new THREE.Vector3();

		}

		var vA = new THREE.Vector3(),
			vB = new THREE.Vector3(),
			vC = new THREE.Vector3(),

			uvA = new THREE.Vector2(),
			uvB = new THREE.Vector2(),
			uvC = new THREE.Vector2(),

			x1, x2, y1, y2, z1, z2,
			s1, s2, t1, t2, r;

		var sdir = new THREE.Vector3(), tdir = new THREE.Vector3();

		function handleTriangle( a, b, c ) {

			vA.fromArray( positions, a * 3 );
			vB.fromArray( positions, b * 3 );
			vC.fromArray( positions, c * 3 );

			uvA.fromArray( uvs, a * 2 );
			uvB.fromArray( uvs, b * 2 );
			uvC.fromArray( uvs, c * 2 );

			x1 = vB.x - vA.x;
			x2 = vC.x - vA.x;

			y1 = vB.y - vA.y;
			y2 = vC.y - vA.y;

			z1 = vB.z - vA.z;
			z2 = vC.z - vA.z;

			s1 = uvB.x - uvA.x;
			s2 = uvC.x - uvA.x;

			t1 = uvB.y - uvA.y;
			t2 = uvC.y - uvA.y;

			r = 1.0 / ( s1 * t2 - s2 * t1 );

			sdir.set(
				( t2 * x1 - t1 * x2 ) * r,
				( t2 * y1 - t1 * y2 ) * r,
				( t2 * z1 - t1 * z2 ) * r
			);

			tdir.set(
				( s1 * x2 - s2 * x1 ) * r,
				( s1 * y2 - s2 * y1 ) * r,
				( s1 * z2 - s2 * z1 ) * r
			);

			tan1[ a ].add( sdir );
			tan1[ b ].add( sdir );
			tan1[ c ].add( sdir );

			tan2[ a ].add( tdir );
			tan2[ b ].add( tdir );
			tan2[ c ].add( tdir );

		}

		var i, il;
		var j, jl;
		var iA, iB, iC;

		if ( this.drawcalls.length === 0 ) {

			this.addDrawCall( 0, indices.length, 0 );

		}

		var drawcalls = this.drawcalls;

		for ( j = 0, jl = drawcalls.length; j < jl; ++ j ) {

			var start = drawcalls[ j ].start;
			var count = drawcalls[ j ].count;
			var index = drawcalls[ j ].index;

			for ( i = start, il = start + count; i < il; i += 3 ) {

				iA = index + indices[ i ];
				iB = index + indices[ i + 1 ];
				iC = index + indices[ i + 2 ];

				handleTriangle( iA, iB, iC );

			}

		}

		var tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3();
		var n = new THREE.Vector3(), n2 = new THREE.Vector3();
		var w, t, test;

		function handleVertex( v ) {

			n.fromArray( normals, v * 3 );
			n2.copy( n );

			t = tan1[ v ];

			// Gram-Schmidt orthogonalize

			tmp.copy( t );
			tmp.sub( n.multiplyScalar( n.dot( t ) ) ).normalize();

			// Calculate handedness

			tmp2.crossVectors( n2, t );
			test = tmp2.dot( tan2[ v ] );
			w = ( test < 0.0 ) ? - 1.0 : 1.0;

			tangents[ v * 4     ] = tmp.x;
			tangents[ v * 4 + 1 ] = tmp.y;
			tangents[ v * 4 + 2 ] = tmp.z;
			tangents[ v * 4 + 3 ] = w;

		}

		for ( j = 0, jl = drawcalls.length; j < jl; ++ j ) {

			var start = drawcalls[ j ].start;
			var count = drawcalls[ j ].count;
			var index = drawcalls[ j ].index;

			for ( i = start, il = start + count; i < il; i += 3 ) {

				iA = index + indices[ i ];
				iB = index + indices[ i + 1 ];
				iC = index + indices[ i + 2 ];

				handleVertex( iA );
				handleVertex( iB );
				handleVertex( iC );

			}

		}

	},

	/*
		computeOffsets
		Compute the draw offset for large models by chunking the index buffer into chunks of 65k addressable vertices.
		This method will effectively rewrite the index buffer and remap all attributes to match the new indices.
		WARNING: This method will also expand the vertex count to prevent sprawled triangles across draw offsets.
		indexBufferSize - Defaults to 65535, but allows for larger or smaller chunks.
	*/
	computeOffsets: function ( indexBufferSize ) {

		var size = indexBufferSize;
		if ( indexBufferSize === undefined )
			size = 65535; //WebGL limits type of index buffer values to 16-bit.

		var s = Date.now();

		var indices = this.attributes.index.array;
		var vertices = this.attributes.position.array;

		var verticesCount = ( vertices.length / 3 );
		var facesCount = ( indices.length / 3 );

		/*
		console.log("Computing buffers in offsets of "+size+" -> indices:"+indices.length+" vertices:"+vertices.length);
		console.log("Faces to process: "+(indices.length/3));
		console.log("Reordering "+verticesCount+" vertices.");
		*/

		var sortedIndices = new Uint16Array( indices.length ); //16-bit buffers
		var indexPtr = 0;
		var vertexPtr = 0;

		var offsets = [ { start:0, count:0, index:0 } ];
		var offset = offsets[ 0 ];

		var duplicatedVertices = 0;
		var newVerticeMaps = 0;
		var faceVertices = new Int32Array( 6 );
		var vertexMap = new Int32Array( vertices.length );
		var revVertexMap = new Int32Array( vertices.length );
		for ( var j = 0; j < vertices.length; j ++ ) { vertexMap[ j ] = - 1; revVertexMap[ j ] = - 1; }

		/*
			Traverse every face and reorder vertices in the proper offsets of 65k.
			We can have more than 65k entries in the index buffer per offset, but only reference 65k values.
		*/
		for ( var findex = 0; findex < facesCount; findex ++ ) {
			newVerticeMaps = 0;

			for ( var vo = 0; vo < 3; vo ++ ) {
				var vid = indices[ findex * 3 + vo ];
				if ( vertexMap[ vid ] == - 1 ) {
					//Unmapped vertice
					faceVertices[ vo * 2 ] = vid;
					faceVertices[ vo * 2 + 1 ] = - 1;
					newVerticeMaps ++;
				} else if ( vertexMap[ vid ] < offset.index ) {
					//Reused vertices from previous block (duplicate)
					faceVertices[ vo * 2 ] = vid;
					faceVertices[ vo * 2 + 1 ] = - 1;
					duplicatedVertices ++;
				} else {
					//Reused vertice in the current block
					faceVertices[ vo * 2 ] = vid;
					faceVertices[ vo * 2 + 1 ] = vertexMap[ vid ];
				}
			}

			var faceMax = vertexPtr + newVerticeMaps;
			if ( faceMax > ( offset.index + size ) ) {
				var new_offset = { start:indexPtr, count:0, index:vertexPtr };
				offsets.push( new_offset );
				offset = new_offset;

				//Re-evaluate reused vertices in light of new offset.
				for ( var v = 0; v < 6; v += 2 ) {
					var new_vid = faceVertices[ v + 1 ];
					if ( new_vid > - 1 && new_vid < offset.index )
						faceVertices[ v + 1 ] = - 1;
				}
			}

			//Reindex the face.
			for ( var v = 0; v < 6; v += 2 ) {
				var vid = faceVertices[ v ];
				var new_vid = faceVertices[ v + 1 ];

				if ( new_vid === - 1 )
					new_vid = vertexPtr ++;

				vertexMap[ vid ] = new_vid;
				revVertexMap[ new_vid ] = vid;
				sortedIndices[ indexPtr ++ ] = new_vid - offset.index; //XXX overflows at 16bit
				offset.count ++;
			}
		}

		/* Move all attribute values to map to the new computed indices , also expand the vertice stack to match our new vertexPtr. */
		this.reorderBuffers( sortedIndices, revVertexMap, vertexPtr );
		this.offsets = offsets;

		/*
		var orderTime = Date.now();
		console.log("Reorder time: "+(orderTime-s)+"ms");
		console.log("Duplicated "+duplicatedVertices+" vertices.");
		console.log("Compute Buffers time: "+(Date.now()-s)+"ms");
		console.log("Draw offsets: "+offsets.length);
		*/

		return offsets;
	},

	merge: function () {

		console.log( 'BufferGeometry.merge(): TODO' );

	},

	normalizeNormals: function () {

		var normals = this.attributes.normal.array;

		var x, y, z, n;

		for ( var i = 0, il = normals.length; i < il; i += 3 ) {

			x = normals[ i ];
			y = normals[ i + 1 ];
			z = normals[ i + 2 ];

			n = 1.0 / Math.sqrt( x * x + y * y + z * z );

			normals[ i     ] *= n;
			normals[ i + 1 ] *= n;
			normals[ i + 2 ] *= n;

		}

	},

	/*
		reoderBuffers:
		Reorder attributes based on a new indexBuffer and indexMap.
		indexBuffer - Uint16Array of the new ordered indices.
		indexMap - Int32Array where the position is the new vertex ID and the value the old vertex ID for each vertex.
		vertexCount - Amount of total vertices considered in this reordering (in case you want to grow the vertice stack).
	*/
	reorderBuffers: function ( indexBuffer, indexMap, vertexCount ) {

		/* Create a copy of all attributes for reordering. */
		var sortedAttributes = {};
		for ( var attr in this.attributes ) {
			if ( attr == 'index' )
				continue;
			var sourceArray = this.attributes[ attr ].array;
			sortedAttributes[ attr ] = new sourceArray.constructor( this.attributes[ attr ].itemSize * vertexCount );
		}

		/* Move attribute positions based on the new index map */
		for ( var new_vid = 0; new_vid < vertexCount; new_vid ++ ) {
			var vid = indexMap[ new_vid ];
			for ( var attr in this.attributes ) {
				if ( attr == 'index' )
					continue;
				var attrArray = this.attributes[ attr ].array;
				var attrSize = this.attributes[ attr ].itemSize;
				var sortedAttr = sortedAttributes[ attr ];
				for ( var k = 0; k < attrSize; k ++ )
					sortedAttr[ new_vid * attrSize + k ] = attrArray[ vid * attrSize + k ];
			}
		}

		/* Carry the new sorted buffers locally */
		this.attributes[ 'index' ].array = indexBuffer;
		for ( var attr in this.attributes ) {
			if ( attr == 'index' )
				continue;
			this.attributes[ attr ].array = sortedAttributes[ attr ];
			this.attributes[ attr ].numItems = this.attributes[ attr ].itemSize * vertexCount;
		}
	},

	toJSON: function () {

		var output = {
			metadata: {
				version: 4.0,
				type: 'BufferGeometry',
				generator: 'BufferGeometryExporter'
			},
			uuid: this.uuid,
			type: this.type,
			data: {
				attributes: {}
			}
		};

		var attributes = this.attributes;
		var offsets = this.offsets;
		var boundingSphere = this.boundingSphere;

		for ( var key in attributes ) {

			var attribute = attributes[ key ];

			var array = [], typeArray = attribute.array;

			for ( var i = 0, l = typeArray.length; i < l; i ++ ) {

				array[ i ] = typeArray[ i ];

			}

			output.data.attributes[ key ] = {
				itemSize: attribute.itemSize,
				type: attribute.array.constructor.name,
				array: array
			}

		}

		if ( offsets.length > 0 ) {

			output.data.offsets = JSON.parse( JSON.stringify( offsets ) );

		}

		if ( boundingSphere !== null ) {

			output.data.boundingSphere = {
				center: boundingSphere.center.toArray(),
				radius: boundingSphere.radius
			}

		}

		return output;

	},

	clone: function () {

		var geometry = new THREE.BufferGeometry();

		for ( var attr in this.attributes ) {

			var sourceAttr = this.attributes[ attr ];
			geometry.addAttribute( attr, sourceAttr.clone() );

		}

		for ( var i = 0, il = this.offsets.length; i < il; i ++ ) {

			var offset = this.offsets[ i ];

			geometry.offsets.push( {

				start: offset.start,
				index: offset.index,
				count: offset.count

			} );

		}

		return geometry;

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

};

THREE.EventDispatcher.prototype.apply( THREE.BufferGeometry.prototype );

// File:src/core/Geometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author kile / http://kile.stravaganza.org/
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author bhouston / http://exocortex.com
 */

THREE.Geometry = function () {

	Object.defineProperty( this, 'id', { value: THREE.GeometryIdCount ++ } );

	this.uuid = THREE.Math.generateUUID();

	this.name = '';
	this.type = 'Geometry';

	this.vertices = [];
	this.colors = [];  // one-to-one vertex colors, used in Points and Line

	this.faces = [];

	this.faceVertexUvs = [ [] ];

	this.morphTargets = [];
	this.morphColors = [];
	this.morphNormals = [];

	this.skinWeights = [];
	this.skinIndices = [];

	this.lineDistances = [];

	this.boundingBox = null;
	this.boundingSphere = null;

	this.hasTangents = false;

	this.dynamic = true; // the intermediate typed arrays will be deleted when set to false

	// update flags

	this.verticesNeedUpdate = false;
	this.elementsNeedUpdate = false;
	this.uvsNeedUpdate = false;
	this.normalsNeedUpdate = false;
	this.tangentsNeedUpdate = false;
	this.colorsNeedUpdate = false;
	this.lineDistancesNeedUpdate = false;

	this.groupsNeedUpdate = false;

};

THREE.Geometry.prototype = {

	constructor: THREE.Geometry,

	applyMatrix: function ( matrix ) {

		var normalMatrix = new THREE.Matrix3().getNormalMatrix( matrix );

		for ( var i = 0, il = this.vertices.length; i < il; i ++ ) {

			var vertex = this.vertices[ i ];
			vertex.applyMatrix4( matrix );

		}

		for ( var i = 0, il = this.faces.length; i < il; i ++ ) {

			var face = this.faces[ i ];
			face.normal.applyMatrix3( normalMatrix ).normalize();

			for ( var j = 0, jl = face.vertexNormals.length; j < jl; j ++ ) {

				face.vertexNormals[ j ].applyMatrix3( normalMatrix ).normalize();

			}

		}

		if ( this.boundingBox instanceof THREE.Box3 ) {

			this.computeBoundingBox();

		}

		if ( this.boundingSphere instanceof THREE.Sphere ) {

			this.computeBoundingSphere();

		}

	},

	fromBufferGeometry: function ( geometry ) {

		var scope = this;

		var attributes = geometry.attributes;

		var vertices = attributes.position.array;
		var indices = attributes.index !== undefined ? attributes.index.array : undefined;
		var normals = attributes.normal !== undefined ? attributes.normal.array : undefined;
		var colors = attributes.color !== undefined ? attributes.color.array : undefined;
		var uvs = attributes.uv !== undefined ? attributes.uv.array : undefined;

		var tempNormals = [];
		var tempUVs = [];

		for ( var i = 0, j = 0; i < vertices.length; i += 3, j += 2 ) {

			scope.vertices.push( new THREE.Vector3( vertices[ i ], vertices[ i + 1 ], vertices[ i + 2 ] ) );

			if ( normals !== undefined ) {

				tempNormals.push( new THREE.Vector3( normals[ i ], normals[ i + 1 ], normals[ i + 2 ] ) );

			}

			if ( colors !== undefined ) {

				scope.colors.push( new THREE.Color( colors[ i ], colors[ i + 1 ], colors[ i + 2 ] ) );

			}

			if ( uvs !== undefined ) {

				tempUVs.push( new THREE.Vector2( uvs[ j ], uvs[ j + 1 ] ) );

			}

		}

		var addFace = function ( a, b, c ) {

			var vertexNormals = normals !== undefined ? [ tempNormals[ a ].clone(), tempNormals[ b ].clone(), tempNormals[ c ].clone() ] : [];
			var vertexColors = colors !== undefined ? [ scope.colors[ a ].clone(), scope.colors[ b ].clone(), scope.colors[ c ].clone() ] : [];

			scope.faces.push( new THREE.Face3( a, b, c, vertexNormals, vertexColors ) );
			scope.faceVertexUvs[ 0 ].push( [ tempUVs[ a ], tempUVs[ b ], tempUVs[ c ] ] );

		};

		if ( indices !== undefined ) {

			for ( var i = 0; i < indices.length; i += 3 ) {

				addFace( indices[ i ], indices[ i + 1 ], indices[ i + 2 ] );

			}

		} else {

			for ( var i = 0; i < vertices.length / 3; i += 3 ) {

				addFace( i, i + 1, i + 2 );

			}

		}
		
		this.computeFaceNormals();

		if ( geometry.boundingBox !== null ) {

			this.boundingBox = geometry.boundingBox.clone();

		}

		if ( geometry.boundingSphere !== null ) {

			this.boundingSphere = geometry.boundingSphere.clone();

		}

		return this;

	},

	center: function () {

		this.computeBoundingBox();

		var offset = new THREE.Vector3();

		offset.addVectors( this.boundingBox.min, this.boundingBox.max );
		offset.multiplyScalar( - 0.5 );

		this.applyMatrix( new THREE.Matrix4().makeTranslation( offset.x, offset.y, offset.z ) );
		this.computeBoundingBox();

		return offset;

	},

	computeFaceNormals: function () {

		var cb = new THREE.Vector3(), ab = new THREE.Vector3();

		for ( var f = 0, fl = this.faces.length; f < fl; f ++ ) {

			var face = this.faces[ f ];

			var vA = this.vertices[ face.a ];
			var vB = this.vertices[ face.b ];
			var vC = this.vertices[ face.c ];

			cb.subVectors( vC, vB );
			ab.subVectors( vA, vB );
			cb.cross( ab );

			cb.normalize();

			face.normal.copy( cb );

		}

	},

	computeVertexNormals: function ( areaWeighted ) {

		var v, vl, f, fl, face, vertices;

		vertices = new Array( this.vertices.length );

		for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {

			vertices[ v ] = new THREE.Vector3();

		}

		if ( areaWeighted ) {

			// vertex normals weighted by triangle areas
			// http://www.iquilezles.org/www/articles/normals/normals.htm

			var vA, vB, vC, vD;
			var cb = new THREE.Vector3(), ab = new THREE.Vector3(),
				db = new THREE.Vector3(), dc = new THREE.Vector3(), bc = new THREE.Vector3();

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				vA = this.vertices[ face.a ];
				vB = this.vertices[ face.b ];
				vC = this.vertices[ face.c ];

				cb.subVectors( vC, vB );
				ab.subVectors( vA, vB );
				cb.cross( ab );

				vertices[ face.a ].add( cb );
				vertices[ face.b ].add( cb );
				vertices[ face.c ].add( cb );

			}

		} else {

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				vertices[ face.a ].add( face.normal );
				vertices[ face.b ].add( face.normal );
				vertices[ face.c ].add( face.normal );

			}

		}

		for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {

			vertices[ v ].normalize();

		}

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];

			face.vertexNormals[ 0 ] = vertices[ face.a ].clone();
			face.vertexNormals[ 1 ] = vertices[ face.b ].clone();
			face.vertexNormals[ 2 ] = vertices[ face.c ].clone();

		}

	},

	computeMorphNormals: function () {

		var i, il, f, fl, face;

		// save original normals
		// - create temp variables on first access
		//   otherwise just copy (for faster repeated calls)

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];

			if ( ! face.__originalFaceNormal ) {

				face.__originalFaceNormal = face.normal.clone();

			} else {

				face.__originalFaceNormal.copy( face.normal );

			}

			if ( ! face.__originalVertexNormals ) face.__originalVertexNormals = [];

			for ( i = 0, il = face.vertexNormals.length; i < il; i ++ ) {

				if ( ! face.__originalVertexNormals[ i ] ) {

					face.__originalVertexNormals[ i ] = face.vertexNormals[ i ].clone();

				} else {

					face.__originalVertexNormals[ i ].copy( face.vertexNormals[ i ] );

				}

			}

		}

		// use temp geometry to compute face and vertex normals for each morph

		var tmpGeo = new THREE.Geometry();
		tmpGeo.faces = this.faces;

		for ( i = 0, il = this.morphTargets.length; i < il; i ++ ) {

			// create on first access

			if ( ! this.morphNormals[ i ] ) {

				this.morphNormals[ i ] = {};
				this.morphNormals[ i ].faceNormals = [];
				this.morphNormals[ i ].vertexNormals = [];

				var dstNormalsFace = this.morphNormals[ i ].faceNormals;
				var dstNormalsVertex = this.morphNormals[ i ].vertexNormals;

				var faceNormal, vertexNormals;

				for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

					faceNormal = new THREE.Vector3();
					vertexNormals = { a: new THREE.Vector3(), b: new THREE.Vector3(), c: new THREE.Vector3() };

					dstNormalsFace.push( faceNormal );
					dstNormalsVertex.push( vertexNormals );

				}

			}

			var morphNormals = this.morphNormals[ i ];

			// set vertices to morph target

			tmpGeo.vertices = this.morphTargets[ i ].vertices;

			// compute morph normals

			tmpGeo.computeFaceNormals();
			tmpGeo.computeVertexNormals();

			// store morph normals

			var faceNormal, vertexNormals;

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				faceNormal = morphNormals.faceNormals[ f ];
				vertexNormals = morphNormals.vertexNormals[ f ];

				faceNormal.copy( face.normal );

				vertexNormals.a.copy( face.vertexNormals[ 0 ] );
				vertexNormals.b.copy( face.vertexNormals[ 1 ] );
				vertexNormals.c.copy( face.vertexNormals[ 2 ] );

			}

		}

		// restore original normals

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];

			face.normal = face.__originalFaceNormal;
			face.vertexNormals = face.__originalVertexNormals;

		}

	},

	computeTangents: function () {

		// based on http://www.terathon.com/code/tangent.html
		// tangents go to vertices

		var f, fl, v, vl, i, il, vertexIndex,
			face, uv, vA, vB, vC, uvA, uvB, uvC,
			x1, x2, y1, y2, z1, z2,
			s1, s2, t1, t2, r, t, test,
			tan1 = [], tan2 = [],
			sdir = new THREE.Vector3(), tdir = new THREE.Vector3(),
			tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3(),
			n = new THREE.Vector3(), w;

		for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {

			tan1[ v ] = new THREE.Vector3();
			tan2[ v ] = new THREE.Vector3();

		}

		function handleTriangle( context, a, b, c, ua, ub, uc ) {

			vA = context.vertices[ a ];
			vB = context.vertices[ b ];
			vC = context.vertices[ c ];

			uvA = uv[ ua ];
			uvB = uv[ ub ];
			uvC = uv[ uc ];

			x1 = vB.x - vA.x;
			x2 = vC.x - vA.x;
			y1 = vB.y - vA.y;
			y2 = vC.y - vA.y;
			z1 = vB.z - vA.z;
			z2 = vC.z - vA.z;

			s1 = uvB.x - uvA.x;
			s2 = uvC.x - uvA.x;
			t1 = uvB.y - uvA.y;
			t2 = uvC.y - uvA.y;

			r = 1.0 / ( s1 * t2 - s2 * t1 );
			sdir.set( ( t2 * x1 - t1 * x2 ) * r,
					  ( t2 * y1 - t1 * y2 ) * r,
					  ( t2 * z1 - t1 * z2 ) * r );
			tdir.set( ( s1 * x2 - s2 * x1 ) * r,
					  ( s1 * y2 - s2 * y1 ) * r,
					  ( s1 * z2 - s2 * z1 ) * r );

			tan1[ a ].add( sdir );
			tan1[ b ].add( sdir );
			tan1[ c ].add( sdir );

			tan2[ a ].add( tdir );
			tan2[ b ].add( tdir );
			tan2[ c ].add( tdir );

		}

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];
			uv = this.faceVertexUvs[ 0 ][ f ]; // use UV layer 0 for tangents

			handleTriangle( this, face.a, face.b, face.c, 0, 1, 2 );

		}

		var faceIndex = [ 'a', 'b', 'c', 'd' ];

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];

			for ( i = 0; i < Math.min( face.vertexNormals.length, 3 ); i ++ ) {

				n.copy( face.vertexNormals[ i ] );

				vertexIndex = face[ faceIndex[ i ] ];

				t = tan1[ vertexIndex ];

				// Gram-Schmidt orthogonalize

				tmp.copy( t );
				tmp.sub( n.multiplyScalar( n.dot( t ) ) ).normalize();

				// Calculate handedness

				tmp2.crossVectors( face.vertexNormals[ i ], t );
				test = tmp2.dot( tan2[ vertexIndex ] );
				w = ( test < 0.0 ) ? - 1.0 : 1.0;

				face.vertexTangents[ i ] = new THREE.Vector4( tmp.x, tmp.y, tmp.z, w );

			}

		}

		this.hasTangents = true;

	},

	computeLineDistances: function () {

		var d = 0;
		var vertices = this.vertices;

		for ( var i = 0, il = vertices.length; i < il; i ++ ) {

			if ( i > 0 ) {

				d += vertices[ i ].distanceTo( vertices[ i - 1 ] );

			}

			this.lineDistances[ i ] = d;

		}

	},

	computeBoundingBox: function () {

		if ( this.boundingBox === null ) {

			this.boundingBox = new THREE.Box3();

		}

		this.boundingBox.setFromPoints( this.vertices );

	},

	computeBoundingSphere: function () {

		if ( this.boundingSphere === null ) {

			this.boundingSphere = new THREE.Sphere();

		}

		this.boundingSphere.setFromPoints( this.vertices );

	},

	merge: function ( geometry, matrix, materialIndexOffset ) {

		if ( geometry instanceof THREE.Geometry === false ) {

			console.error( 'THREE.Geometry.merge(): geometry not an instance of THREE.Geometry.', geometry );
			return;

		}

		var normalMatrix,
		vertexOffset = this.vertices.length,
		vertices1 = this.vertices,
		vertices2 = geometry.vertices,
		faces1 = this.faces,
		faces2 = geometry.faces,
		uvs1 = this.faceVertexUvs[ 0 ],
		uvs2 = geometry.faceVertexUvs[ 0 ];

		if ( materialIndexOffset === undefined ) materialIndexOffset = 0;

		if ( matrix !== undefined ) {

			normalMatrix = new THREE.Matrix3().getNormalMatrix( matrix );

		}

		// vertices

		for ( var i = 0, il = vertices2.length; i < il; i ++ ) {

			var vertex = vertices2[ i ];

			var vertexCopy = vertex.clone();

			if ( matrix !== undefined ) vertexCopy.applyMatrix4( matrix );

			vertices1.push( vertexCopy );

		}

		// faces

		for ( i = 0, il = faces2.length; i < il; i ++ ) {

			var face = faces2[ i ], faceCopy, normal, color,
			faceVertexNormals = face.vertexNormals,
			faceVertexColors = face.vertexColors;

			faceCopy = new THREE.Face3( face.a + vertexOffset, face.b + vertexOffset, face.c + vertexOffset );
			faceCopy.normal.copy( face.normal );

			if ( normalMatrix !== undefined ) {

				faceCopy.normal.applyMatrix3( normalMatrix ).normalize();

			}

			for ( var j = 0, jl = faceVertexNormals.length; j < jl; j ++ ) {

				normal = faceVertexNormals[ j ].clone();

				if ( normalMatrix !== undefined ) {

					normal.applyMatrix3( normalMatrix ).normalize();

				}

				faceCopy.vertexNormals.push( normal );

			}

			faceCopy.color.copy( face.color );

			for ( var j = 0, jl = faceVertexColors.length; j < jl; j ++ ) {

				color = faceVertexColors[ j ];
				faceCopy.vertexColors.push( color.clone() );

			}

			faceCopy.materialIndex = face.materialIndex + materialIndexOffset;

			faces1.push( faceCopy );

		}

		// uvs

		for ( i = 0, il = uvs2.length; i < il; i ++ ) {

			var uv = uvs2[ i ], uvCopy = [];

			if ( uv === undefined ) {

				continue;

			}

			for ( var j = 0, jl = uv.length; j < jl; j ++ ) {

				uvCopy.push( new THREE.Vector2( uv[ j ].x, uv[ j ].y ) );

			}

			uvs1.push( uvCopy );

		}

	},

	/*
	 * Checks for duplicate vertices with hashmap.
	 * Duplicated vertices are removed
	 * and faces' vertices are updated.
	 */

	mergeVertices: function () {

		var verticesMap = {}; // Hashmap for looking up vertice by position coordinates (and making sure they are unique)
		var unique = [], changes = [];

		var v, key;
		var precisionPoints = 4; // number of decimal points, eg. 4 for epsilon of 0.0001
		var precision = Math.pow( 10, precisionPoints );
		var i,il, face;
		var indices, k, j, jl, u;

		for ( i = 0, il = this.vertices.length; i < il; i ++ ) {

			v = this.vertices[ i ];
			key = Math.round( v.x * precision ) + '_' + Math.round( v.y * precision ) + '_' + Math.round( v.z * precision );

			if ( verticesMap[ key ] === undefined ) {

				verticesMap[ key ] = i;
				unique.push( this.vertices[ i ] );
				changes[ i ] = unique.length - 1;

			} else {

				//console.log('Duplicate vertex found. ', i, ' could be using ', verticesMap[key]);
				changes[ i ] = changes[ verticesMap[ key ] ];

			}

		};


		// if faces are completely degenerate after merging vertices, we
		// have to remove them from the geometry.
		var faceIndicesToRemove = [];

		for ( i = 0, il = this.faces.length; i < il; i ++ ) {

			face = this.faces[ i ];

			face.a = changes[ face.a ];
			face.b = changes[ face.b ];
			face.c = changes[ face.c ];

			indices = [ face.a, face.b, face.c ];

			var dupIndex = - 1;

			// if any duplicate vertices are found in a Face3
			// we have to remove the face as nothing can be saved
			for ( var n = 0; n < 3; n ++ ) {
				if ( indices[ n ] == indices[ ( n + 1 ) % 3 ] ) {

					dupIndex = n;
					faceIndicesToRemove.push( i );
					break;

				}
			}

		}

		for ( i = faceIndicesToRemove.length - 1; i >= 0; i -- ) {
			var idx = faceIndicesToRemove[ i ];

			this.faces.splice( idx, 1 );

			for ( j = 0, jl = this.faceVertexUvs.length; j < jl; j ++ ) {

				this.faceVertexUvs[ j ].splice( idx, 1 );

			}

		}

		// Use unique set of vertices

		var diff = this.vertices.length - unique.length;
		this.vertices = unique;
		return diff;

	},

	toJSON: function () {

		var output = {
			metadata: {
				version: 4.0,
				type: 'BufferGeometry',
				generator: 'BufferGeometryExporter'
			},
			uuid: this.uuid,
			type: this.type
		};

		if ( this.name !== "" ) output.name = this.name;

		if ( this.parameters !== undefined ) {

			var parameters = this.parameters;

			for ( var key in parameters ) {

				if ( parameters[ key ] !== undefined ) output[ key ] = parameters[ key ];

			}

			return output;

		}

		var vertices = [];

		for ( var i = 0; i < this.vertices.length; i ++ ) {

			var vertex = this.vertices[ i ];
			vertices.push( vertex.x, vertex.y, vertex.z );

		}

		var faces = [];
		var normals = [];
		var normalsHash = {};
		var colors = [];
		var colorsHash = {};
		var uvs = [];
		var uvsHash = {};

		for ( var i = 0; i < this.faces.length; i ++ ) {

			var face = this.faces[ i ];

			var hasMaterial = false; // face.materialIndex !== undefined;
			var hasFaceUv = false; // deprecated
			var hasFaceVertexUv = this.faceVertexUvs[ 0 ][ i ] !== undefined;
			var hasFaceNormal = face.normal.length() > 0;
			var hasFaceVertexNormal = face.vertexNormals.length > 0;
			var hasFaceColor = face.color.r !== 1 || face.color.g !== 1 || face.color.b !== 1;
			var hasFaceVertexColor = face.vertexColors.length > 0;

			var faceType = 0;

			faceType = setBit( faceType, 0, 0 );
			faceType = setBit( faceType, 1, hasMaterial );
			faceType = setBit( faceType, 2, hasFaceUv );
			faceType = setBit( faceType, 3, hasFaceVertexUv );
			faceType = setBit( faceType, 4, hasFaceNormal );
			faceType = setBit( faceType, 5, hasFaceVertexNormal );
			faceType = setBit( faceType, 6, hasFaceColor );
			faceType = setBit( faceType, 7, hasFaceVertexColor );

			faces.push( faceType );
			faces.push( face.a, face.b, face.c );


			/*
			if ( hasMaterial ) {

				faces.push( face.materialIndex );

			}
			*/

			if ( hasFaceVertexUv ) {

				var faceVertexUvs = this.faceVertexUvs[ 0 ][ i ];

				faces.push(
					getUvIndex( faceVertexUvs[ 0 ] ),
					getUvIndex( faceVertexUvs[ 1 ] ),
					getUvIndex( faceVertexUvs[ 2 ] )
				);

			}

			if ( hasFaceNormal ) {

				faces.push( getNormalIndex( face.normal ) );

			}

			if ( hasFaceVertexNormal ) {

				var vertexNormals = face.vertexNormals;

				faces.push(
					getNormalIndex( vertexNormals[ 0 ] ),
					getNormalIndex( vertexNormals[ 1 ] ),
					getNormalIndex( vertexNormals[ 2 ] )
				);

			}

			if ( hasFaceColor ) {

				faces.push( getColorIndex( face.color ) );

			}

			if ( hasFaceVertexColor ) {

				var vertexColors = face.vertexColors;

				faces.push(
					getColorIndex( vertexColors[ 0 ] ),
					getColorIndex( vertexColors[ 1 ] ),
					getColorIndex( vertexColors[ 2 ] )
				);

			}

		}

		function setBit( value, position, enabled ) {

			return enabled ? value | ( 1 << position ) : value & ( ~ ( 1 << position) );

		}

		function getNormalIndex( normal ) {

			var hash = normal.x.toString() + normal.y.toString() + normal.z.toString();

			if ( normalsHash[ hash ] !== undefined ) {

				return normalsHash[ hash ];

			}

			normalsHash[ hash ] = normals.length / 3;
			normals.push( normal.x, normal.y, normal.z );

			return normalsHash[ hash ];

		}

		function getColorIndex( color ) {

			var hash = color.r.toString() + color.g.toString() + color.b.toString();

			if ( colorsHash[ hash ] !== undefined ) {

				return colorsHash[ hash ];

			}

			colorsHash[ hash ] = colors.length;
			colors.push( color.getHex() );

			return colorsHash[ hash ];

		}

		function getUvIndex( uv ) {

			var hash = uv.x.toString() + uv.y.toString();

			if ( uvsHash[ hash ] !== undefined ) {

				return uvsHash[ hash ];

			}

			uvsHash[ hash ] = uvs.length / 2;
			uvs.push( uv.x, uv.y );

			return uvsHash[ hash ];

		}

		output.data = {};

		output.data.vertices = vertices;
		output.data.normals = normals;
		if ( colors.length > 0 ) output.data.colors = colors;
		if ( uvs.length > 0 ) output.data.uvs = [ uvs ]; // temporal backward compatibility
		output.data.faces = faces;

		//

		return output;

	},

	clone: function () {

		var geometry = new THREE.Geometry();

		var vertices = this.vertices;

		for ( var i = 0, il = vertices.length; i < il; i ++ ) {

			geometry.vertices.push( vertices[ i ].clone() );

		}

		var faces = this.faces;

		for ( var i = 0, il = faces.length; i < il; i ++ ) {

			geometry.faces.push( faces[ i ].clone() );

		}

		var uvs = this.faceVertexUvs[ 0 ];

		for ( var i = 0, il = uvs.length; i < il; i ++ ) {

			var uv = uvs[ i ], uvCopy = [];

			for ( var j = 0, jl = uv.length; j < jl; j ++ ) {

				uvCopy.push( new THREE.Vector2( uv[ j ].x, uv[ j ].y ) );

			}

			geometry.faceVertexUvs[ 0 ].push( uvCopy );

		}

		return geometry;

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

};

THREE.EventDispatcher.prototype.apply( THREE.Geometry.prototype );

THREE.GeometryIdCount = 0;

// File:src/cameras/Camera.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 * @author WestLangley / http://github.com/WestLangley
*/

THREE.Camera = function () {

	THREE.Object3D.call( this );

	this.type = 'Camera';

	this.matrixWorldInverse = new THREE.Matrix4();
	this.projectionMatrix = new THREE.Matrix4();

};

THREE.Camera.prototype = Object.create( THREE.Object3D.prototype );

THREE.Camera.prototype.getWorldDirection = function () {

	var quaternion = new THREE.Quaternion();

	return function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();

		this.getWorldQuaternion( quaternion );

		return result.set( 0, 0, - 1 ).applyQuaternion( quaternion );

	}

}();

THREE.Camera.prototype.lookAt = function () {

	// This routine does not support cameras with rotated and/or translated parent(s)

	var m1 = new THREE.Matrix4();

	return function ( vector ) {

		m1.lookAt( this.position, vector, this.up );

		this.quaternion.setFromRotationMatrix( m1 );

	};

}();

THREE.Camera.prototype.clone = function ( camera ) {

	if ( camera === undefined ) camera = new THREE.Camera();

	THREE.Object3D.prototype.clone.call( this, camera );

	camera.matrixWorldInverse.copy( this.matrixWorldInverse );
	camera.projectionMatrix.copy( this.projectionMatrix );

	return camera;
};

// File:src/cameras/CubeCamera.js

/**
 * Camera for rendering cube maps
 *	- renders scene into axis-aligned cube
 *
 * @author alteredq / http://alteredqualia.com/
 */

THREE.CubeCamera = function ( near, far, cubeResolution ) {

	THREE.Object3D.call( this );

	this.type = 'CubeCamera';

	var fov = 90, aspect = 1;

	var cameraPX = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraPX.up.set( 0, - 1, 0 );
	cameraPX.lookAt( new THREE.Vector3( 1, 0, 0 ) );
	this.add( cameraPX );

	var cameraNX = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraNX.up.set( 0, - 1, 0 );
	cameraNX.lookAt( new THREE.Vector3( - 1, 0, 0 ) );
	this.add( cameraNX );

	var cameraPY = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraPY.up.set( 0, 0, 1 );
	cameraPY.lookAt( new THREE.Vector3( 0, 1, 0 ) );
	this.add( cameraPY );

	var cameraNY = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraNY.up.set( 0, 0, - 1 );
	cameraNY.lookAt( new THREE.Vector3( 0, - 1, 0 ) );
	this.add( cameraNY );

	var cameraPZ = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraPZ.up.set( 0, - 1, 0 );
	cameraPZ.lookAt( new THREE.Vector3( 0, 0, 1 ) );
	this.add( cameraPZ );

	var cameraNZ = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraNZ.up.set( 0, - 1, 0 );
	cameraNZ.lookAt( new THREE.Vector3( 0, 0, - 1 ) );
	this.add( cameraNZ );

	this.renderTarget = new THREE.WebGLRenderTargetCube( cubeResolution, cubeResolution, { format: THREE.RGBFormat, magFilter: THREE.LinearFilter, minFilter: THREE.LinearFilter } );

	this.updateCubeMap = function ( renderer, scene ) {

		var renderTarget = this.renderTarget;
		var generateMipmaps = renderTarget.generateMipmaps;

		renderTarget.generateMipmaps = false;

		renderTarget.activeCubeFace = 0;
		renderer.render( scene, cameraPX, renderTarget );

		renderTarget.activeCubeFace = 1;
		renderer.render( scene, cameraNX, renderTarget );

		renderTarget.activeCubeFace = 2;
		renderer.render( scene, cameraPY, renderTarget );

		renderTarget.activeCubeFace = 3;
		renderer.render( scene, cameraNY, renderTarget );

		renderTarget.activeCubeFace = 4;
		renderer.render( scene, cameraPZ, renderTarget );

		renderTarget.generateMipmaps = generateMipmaps;

		renderTarget.activeCubeFace = 5;
		renderer.render( scene, cameraNZ, renderTarget );

	};

};

THREE.CubeCamera.prototype = Object.create( THREE.Object3D.prototype );

// File:src/cameras/OrthographicCamera.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.OrthographicCamera = function ( left, right, top, bottom, near, far ) {

	THREE.Camera.call( this );

	this.type = 'OrthographicCamera';

	this.zoom = 1;

	this.left = left;
	this.right = right;
	this.top = top;
	this.bottom = bottom;

	this.near = ( near !== undefined ) ? near : 0.1;
	this.far = ( far !== undefined ) ? far : 2000;

	this.updateProjectionMatrix();

};

THREE.OrthographicCamera.prototype = Object.create( THREE.Camera.prototype );

THREE.OrthographicCamera.prototype.updateProjectionMatrix = function () {

	var dx = ( this.right - this.left ) / ( 2 * this.zoom );
	var dy = ( this.top - this.bottom ) / ( 2 * this.zoom );
	var cx = ( this.right + this.left ) / 2;
	var cy = ( this.top + this.bottom ) / 2;

	this.projectionMatrix.makeOrthographic( cx - dx, cx + dx, cy + dy, cy - dy, this.near, this.far );

};

THREE.OrthographicCamera.prototype.clone = function () {

	var camera = new THREE.OrthographicCamera();

	THREE.Camera.prototype.clone.call( this, camera );

	camera.zoom = this.zoom;

	camera.left = this.left;
	camera.right = this.right;
	camera.top = this.top;
	camera.bottom = this.bottom;

	camera.near = this.near;
	camera.far = this.far;

	camera.projectionMatrix.copy( this.projectionMatrix );

	return camera;
};

// File:src/cameras/PerspectiveCamera.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author greggman / http://games.greggman.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

THREE.PerspectiveCamera = function ( fov, aspect, near, far ) {

	THREE.Camera.call( this );

	this.type = 'PerspectiveCamera';

	this.zoom = 1;

	this.fov = fov !== undefined ? fov : 50;
	this.aspect = aspect !== undefined ? aspect : 1;
	this.near = near !== undefined ? near : 0.1;
	this.far = far !== undefined ? far : 2000;

	this.updateProjectionMatrix();

};

THREE.PerspectiveCamera.prototype = Object.create( THREE.Camera.prototype );


/**
 * Uses Focal Length (in mm) to estimate and set FOV
 * 35mm (fullframe) camera is used if frame size is not specified;
 * Formula based on http://www.bobatkins.com/photography/technical/field_of_view.html
 */

THREE.PerspectiveCamera.prototype.setLens = function ( focalLength, frameHeight ) {

	if ( frameHeight === undefined ) frameHeight = 24;

	this.fov = 2 * THREE.Math.radToDeg( Math.atan( frameHeight / ( focalLength * 2 ) ) );
	this.updateProjectionMatrix();

}


/**
 * Sets an offset in a larger frustum. This is useful for multi-window or
 * multi-monitor/multi-machine setups.
 *
 * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
 * the monitors are in grid like this
 *
 *   +---+---+---+
 *   | A | B | C |
 *   +---+---+---+
 *   | D | E | F |
 *   +---+---+---+
 *
 * then for each monitor you would call it like this
 *
 *   var w = 1920;
 *   var h = 1080;
 *   var fullWidth = w * 3;
 *   var fullHeight = h * 2;
 *
 *   --A--
 *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
 *   --B--
 *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
 *   --C--
 *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
 *   --D--
 *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
 *   --E--
 *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
 *   --F--
 *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
 *
 *   Note there is no reason monitors have to be the same size or in a grid.
 */

THREE.PerspectiveCamera.prototype.setViewOffset = function ( fullWidth, fullHeight, x, y, width, height ) {

	this.fullWidth = fullWidth;
	this.fullHeight = fullHeight;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.updateProjectionMatrix();

};


THREE.PerspectiveCamera.prototype.updateProjectionMatrix = function () {

	var fov = THREE.Math.radToDeg( 2 * Math.atan( Math.tan( THREE.Math.degToRad( this.fov ) * 0.5 ) / this.zoom ) );

	if ( this.fullWidth ) {

		var aspect = this.fullWidth / this.fullHeight;
		var top = Math.tan( THREE.Math.degToRad( fov * 0.5 ) ) * this.near;
		var bottom = - top;
		var left = aspect * bottom;
		var right = aspect * top;
		var width = Math.abs( right - left );
		var height = Math.abs( top - bottom );

		this.projectionMatrix.makeFrustum(
			left + this.x * width / this.fullWidth,
			left + ( this.x + this.width ) * width / this.fullWidth,
			top - ( this.y + this.height ) * height / this.fullHeight,
			top - this.y * height / this.fullHeight,
			this.near,
			this.far
		);

	} else {

		this.projectionMatrix.makePerspective( fov, this.aspect, this.near, this.far );

	}

};

THREE.PerspectiveCamera.prototype.clone = function () {

	var camera = new THREE.PerspectiveCamera();

	THREE.Camera.prototype.clone.call( this, camera );

	camera.zoom = this.zoom;

	camera.fov = this.fov;
	camera.aspect = this.aspect;
	camera.near = this.near;
	camera.far = this.far;

	camera.projectionMatrix.copy( this.projectionMatrix );

	return camera;

};

// File:src/lights/Light.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Light = function ( color ) {

	THREE.Object3D.call( this );

	this.type = 'Light';
	
	this.color = new THREE.Color( color );

};

THREE.Light.prototype = Object.create( THREE.Object3D.prototype );

THREE.Light.prototype.clone = function ( light ) {

	if ( light === undefined ) light = new THREE.Light();

	THREE.Object3D.prototype.clone.call( this, light );

	light.color.copy( this.color );

	return light;

};

// File:src/lights/AmbientLight.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.AmbientLight = function ( color ) {

	THREE.Light.call( this, color );

	this.type = 'AmbientLight';

};

THREE.AmbientLight.prototype = Object.create( THREE.Light.prototype );

THREE.AmbientLight.prototype.clone = function () {

	var light = new THREE.AmbientLight();

	THREE.Light.prototype.clone.call( this, light );

	return light;

};

// File:src/lights/AreaLight.js

/**
 * @author MPanknin / http://www.redplant.de/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.AreaLight = function ( color, intensity ) {

	THREE.Light.call( this, color );

	this.type = 'AreaLight';

	this.normal = new THREE.Vector3( 0, - 1, 0 );
	this.right = new THREE.Vector3( 1, 0, 0 );

	this.intensity = ( intensity !== undefined ) ? intensity : 1;

	this.width = 1.0;
	this.height = 1.0;

	this.constantAttenuation = 1.5;
	this.linearAttenuation = 0.5;
	this.quadraticAttenuation = 0.1;

};

THREE.AreaLight.prototype = Object.create( THREE.Light.prototype );


// File:src/lights/DirectionalLight.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.DirectionalLight = function ( color, intensity ) {

	THREE.Light.call( this, color );

	this.type = 'DirectionalLight';

	this.position.set( 0, 1, 0 );
	this.target = new THREE.Object3D();

	this.intensity = ( intensity !== undefined ) ? intensity : 1;

	this.castShadow = false;
	this.onlyShadow = false;

	//

	this.shadowCameraNear = 50;
	this.shadowCameraFar = 5000;

	this.shadowCameraLeft = - 500;
	this.shadowCameraRight = 500;
	this.shadowCameraTop = 500;
	this.shadowCameraBottom = - 500;

	this.shadowCameraVisible = false;

	this.shadowBias = 0;
	this.shadowDarkness = 0.5;

	this.shadowMapWidth = 512;
	this.shadowMapHeight = 512;

	//

	this.shadowCascade = false;

	this.shadowCascadeOffset = new THREE.Vector3( 0, 0, - 1000 );
	this.shadowCascadeCount = 2;

	this.shadowCascadeBias = [ 0, 0, 0 ];
	this.shadowCascadeWidth = [ 512, 512, 512 ];
	this.shadowCascadeHeight = [ 512, 512, 512 ];

	this.shadowCascadeNearZ = [ - 1.000, 0.990, 0.998 ];
	this.shadowCascadeFarZ  = [  0.990, 0.998, 1.000 ];

	this.shadowCascadeArray = [];

	//

	this.shadowMap = null;
	this.shadowMapSize = null;
	this.shadowCamera = null;
	this.shadowMatrix = null;

};

THREE.DirectionalLight.prototype = Object.create( THREE.Light.prototype );

THREE.DirectionalLight.prototype.clone = function () {

	var light = new THREE.DirectionalLight();

	THREE.Light.prototype.clone.call( this, light );

	light.target = this.target.clone();

	light.intensity = this.intensity;

	light.castShadow = this.castShadow;
	light.onlyShadow = this.onlyShadow;

	//

	light.shadowCameraNear = this.shadowCameraNear;
	light.shadowCameraFar = this.shadowCameraFar;

	light.shadowCameraLeft = this.shadowCameraLeft;
	light.shadowCameraRight = this.shadowCameraRight;
	light.shadowCameraTop = this.shadowCameraTop;
	light.shadowCameraBottom = this.shadowCameraBottom;

	light.shadowCameraVisible = this.shadowCameraVisible;

	light.shadowBias = this.shadowBias;
	light.shadowDarkness = this.shadowDarkness;

	light.shadowMapWidth = this.shadowMapWidth;
	light.shadowMapHeight = this.shadowMapHeight;

	//

	light.shadowCascade = this.shadowCascade;

	light.shadowCascadeOffset.copy( this.shadowCascadeOffset );
	light.shadowCascadeCount = this.shadowCascadeCount;

	light.shadowCascadeBias = this.shadowCascadeBias.slice( 0 );
	light.shadowCascadeWidth = this.shadowCascadeWidth.slice( 0 );
	light.shadowCascadeHeight = this.shadowCascadeHeight.slice( 0 );

	light.shadowCascadeNearZ = this.shadowCascadeNearZ.slice( 0 );
	light.shadowCascadeFarZ  = this.shadowCascadeFarZ.slice( 0 );

	return light;

};

// File:src/lights/HemisphereLight.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.HemisphereLight = function ( skyColor, groundColor, intensity ) {

	THREE.Light.call( this, skyColor );

	this.type = 'HemisphereLight';

	this.position.set( 0, 100, 0 );

	this.groundColor = new THREE.Color( groundColor );
	this.intensity = ( intensity !== undefined ) ? intensity : 1;

};

THREE.HemisphereLight.prototype = Object.create( THREE.Light.prototype );

THREE.HemisphereLight.prototype.clone = function () {

	var light = new THREE.HemisphereLight();

	THREE.Light.prototype.clone.call( this, light );

	light.groundColor.copy( this.groundColor );
	light.intensity = this.intensity;

	return light;

};

// File:src/lights/PointLight.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointLight = function ( color, intensity, distance ) {

	THREE.Light.call( this, color );

	this.type = 'PointLight';

	this.intensity = ( intensity !== undefined ) ? intensity : 1;
	this.distance = ( distance !== undefined ) ? distance : 0;

};

THREE.PointLight.prototype = Object.create( THREE.Light.prototype );

THREE.PointLight.prototype.clone = function () {

	var light = new THREE.PointLight();

	THREE.Light.prototype.clone.call( this, light );

	light.intensity = this.intensity;
	light.distance = this.distance;

	return light;

};

// File:src/lights/SpotLight.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.SpotLight = function ( color, intensity, distance, angle, exponent ) {

	THREE.Light.call( this, color );

	this.type = 'SpotLight';

	this.position.set( 0, 1, 0 );
	this.target = new THREE.Object3D();

	this.intensity = ( intensity !== undefined ) ? intensity : 1;
	this.distance = ( distance !== undefined ) ? distance : 0;
	this.angle = ( angle !== undefined ) ? angle : Math.PI / 3;
	this.exponent = ( exponent !== undefined ) ? exponent : 10;

	this.castShadow = false;
	this.onlyShadow = false;

	//

	this.shadowCameraNear = 50;
	this.shadowCameraFar = 5000;
	this.shadowCameraFov = 50;

	this.shadowCameraVisible = false;

	this.shadowBias = 0;
	this.shadowDarkness = 0.5;

	this.shadowMapWidth = 512;
	this.shadowMapHeight = 512;

	//

	this.shadowMap = null;
	this.shadowMapSize = null;
	this.shadowCamera = null;
	this.shadowMatrix = null;

};

THREE.SpotLight.prototype = Object.create( THREE.Light.prototype );

THREE.SpotLight.prototype.clone = function () {

	var light = new THREE.SpotLight();

	THREE.Light.prototype.clone.call( this, light );

	light.target = this.target.clone();

	light.intensity = this.intensity;
	light.distance = this.distance;
	light.angle = this.angle;
	light.exponent = this.exponent;

	light.castShadow = this.castShadow;
	light.onlyShadow = this.onlyShadow;

	//

	light.shadowCameraNear = this.shadowCameraNear;
	light.shadowCameraFar = this.shadowCameraFar;
	light.shadowCameraFov = this.shadowCameraFov;

	light.shadowCameraVisible = this.shadowCameraVisible;

	light.shadowBias = this.shadowBias;
	light.shadowDarkness = this.shadowDarkness;

	light.shadowMapWidth = this.shadowMapWidth;
	light.shadowMapHeight = this.shadowMapHeight;

	return light;

};

// File:src/loaders/Cache.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Cache = function () {

	this.files = {};

};

THREE.Cache.prototype = {

	constructor: THREE.Cache,

	add: function ( key, file ) {

		// console.log( 'THREE.Cache', 'Adding key:', key );

		this.files[ key ] = file;

	},

	get: function ( key ) {

		// console.log( 'THREE.Cache', 'Checking key:', key );

		return this.files[ key ];

	},

	remove: function ( key ) {

		delete this.files[ key ];

	},

	clear: function () {

		this.files = {}

	}

};

// File:src/loaders/Loader.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Loader = function ( showStatus ) {

	this.showStatus = showStatus;
	this.statusDomElement = showStatus ? THREE.Loader.prototype.addStatusElement() : null;

	this.imageLoader = new THREE.ImageLoader();

	this.onLoadStart = function () {};
	this.onLoadProgress = function () {};
	this.onLoadComplete = function () {};

};

THREE.Loader.prototype = {

	constructor: THREE.Loader,

	crossOrigin: undefined,

	addStatusElement: function () {

		var e = document.createElement( 'div' );

		e.style.position = 'absolute';
		e.style.right = '0px';
		e.style.top = '0px';
		e.style.fontSize = '0.8em';
		e.style.textAlign = 'left';
		e.style.background = 'rgba(0,0,0,0.25)';
		e.style.color = '#fff';
		e.style.width = '120px';
		e.style.padding = '0.5em 0.5em 0.5em 0.5em';
		e.style.zIndex = 1000;

		e.innerHTML = 'Loading ...';

		return e;

	},

	updateProgress: function ( progress ) {

		var message = 'Loaded ';

		if ( progress.total ) {

			message += ( 100 * progress.loaded / progress.total ).toFixed( 0 ) + '%';


		} else {

			message += ( progress.loaded / 1024 ).toFixed( 2 ) + ' KB';

		}

		this.statusDomElement.innerHTML = message;

	},

	extractUrlBase: function ( url ) {

		var parts = url.split( '/' );

		if ( parts.length === 1 ) return './';

		parts.pop();

		return parts.join( '/' ) + '/';

	},

	initMaterials: function ( materials, texturePath ) {

		var array = [];

		for ( var i = 0; i < materials.length; ++ i ) {

			array[ i ] = this.createMaterial( materials[ i ], texturePath );

		}

		return array;

	},

	needsTangents: function ( materials ) {

		for ( var i = 0, il = materials.length; i < il; i ++ ) {

			var m = materials[ i ];

			if ( m instanceof THREE.ShaderMaterial ) return true;

		}

		return false;

	},

	createMaterial: function ( m, texturePath ) {

		var scope = this;

		function nearest_pow2( n ) {

			var l = Math.log( n ) / Math.LN2;
			return Math.pow( 2, Math.round(  l ) );

		}

		function create_texture( where, name, sourceFile, repeat, offset, wrap, anisotropy ) {

			var fullPath = texturePath + sourceFile;

			var texture;

			var loader = THREE.Loader.Handlers.get( fullPath );

			if ( loader !== null ) {

				texture = loader.load( fullPath );

			} else {

				texture = new THREE.Texture();

				loader = scope.imageLoader;
				loader.crossOrigin = scope.crossOrigin;
				loader.load( fullPath, function ( image ) {

					if ( THREE.Math.isPowerOfTwo( image.width ) === false ||
						 THREE.Math.isPowerOfTwo( image.height ) === false ) {

						var width = nearest_pow2( image.width );
						var height = nearest_pow2( image.height );

						var canvas = document.createElement( 'canvas' );
						canvas.width = width;
						canvas.height = height;

						var context = canvas.getContext( '2d' );
						context.drawImage( image, 0, 0, width, height );

						texture.image = canvas;

					} else {

						texture.image = image;

					}

					texture.needsUpdate = true;

				} );

			}

			texture.sourceFile = sourceFile;

			if ( repeat ) {

				texture.repeat.set( repeat[ 0 ], repeat[ 1 ] );

				if ( repeat[ 0 ] !== 1 ) texture.wrapS = THREE.RepeatWrapping;
				if ( repeat[ 1 ] !== 1 ) texture.wrapT = THREE.RepeatWrapping;

			}

			if ( offset ) {

				texture.offset.set( offset[ 0 ], offset[ 1 ] );

			}

			if ( wrap ) {

				var wrapMap = {
					'repeat': THREE.RepeatWrapping,
					'mirror': THREE.MirroredRepeatWrapping
				}

				if ( wrapMap[ wrap[ 0 ] ] !== undefined ) texture.wrapS = wrapMap[ wrap[ 0 ] ];
				if ( wrapMap[ wrap[ 1 ] ] !== undefined ) texture.wrapT = wrapMap[ wrap[ 1 ] ];

			}

			if ( anisotropy ) {

				texture.anisotropy = anisotropy;

			}

			where[ name ] = texture;

		}

		function rgb2hex( rgb ) {

			return ( rgb[ 0 ] * 255 << 16 ) + ( rgb[ 1 ] * 255 << 8 ) + rgb[ 2 ] * 255;

		}

		// defaults

		var mtype = 'MeshLambertMaterial';
		var mpars = { color: 0xeeeeee, opacity: 1.0, map: null, lightMap: null, normalMap: null, bumpMap: null, wireframe: false };

		// parameters from model file

		if ( m.shading ) {

			var shading = m.shading.toLowerCase();

			if ( shading === 'phong' ) mtype = 'MeshPhongMaterial';
			else if ( shading === 'basic' ) mtype = 'MeshBasicMaterial';

		}

		if ( m.blending !== undefined && THREE[ m.blending ] !== undefined ) {

			mpars.blending = THREE[ m.blending ];

		}

		if ( m.transparent !== undefined || m.opacity < 1.0 ) {

			mpars.transparent = m.transparent;

		}

		if ( m.depthTest !== undefined ) {

			mpars.depthTest = m.depthTest;

		}

		if ( m.depthWrite !== undefined ) {

			mpars.depthWrite = m.depthWrite;

		}

		if ( m.visible !== undefined ) {

			mpars.visible = m.visible;

		}

		if ( m.flipSided !== undefined ) {

			mpars.side = THREE.BackSide;

		}

		if ( m.doubleSided !== undefined ) {

			mpars.side = THREE.DoubleSide;

		}

		if ( m.wireframe !== undefined ) {

			mpars.wireframe = m.wireframe;

		}

		if ( m.vertexColors !== undefined ) {

			if ( m.vertexColors === 'face' ) {

				mpars.vertexColors = THREE.FaceColors;

			} else if ( m.vertexColors ) {

				mpars.vertexColors = THREE.VertexColors;

			}

		}

		// colors

		if ( m.colorDiffuse ) {

			mpars.color = rgb2hex( m.colorDiffuse );

		} else if ( m.DbgColor ) {

			mpars.color = m.DbgColor;

		}

		if ( m.colorSpecular ) {

			mpars.specular = rgb2hex( m.colorSpecular );

		}

		if ( m.colorAmbient ) {

			mpars.ambient = rgb2hex( m.colorAmbient );

		}

		if ( m.colorEmissive ) {

			mpars.emissive = rgb2hex( m.colorEmissive );

		}

		// modifiers

		if ( m.transparency ) {

			mpars.opacity = m.transparency;

		}

		if ( m.specularCoef ) {

			mpars.shininess = m.specularCoef;

		}

		// textures

		if ( m.mapDiffuse && texturePath ) {

			create_texture( mpars, 'map', m.mapDiffuse, m.mapDiffuseRepeat, m.mapDiffuseOffset, m.mapDiffuseWrap, m.mapDiffuseAnisotropy );

		}

		if ( m.mapLight && texturePath ) {

			create_texture( mpars, 'lightMap', m.mapLight, m.mapLightRepeat, m.mapLightOffset, m.mapLightWrap, m.mapLightAnisotropy );

		}

		if ( m.mapBump && texturePath ) {

			create_texture( mpars, 'bumpMap', m.mapBump, m.mapBumpRepeat, m.mapBumpOffset, m.mapBumpWrap, m.mapBumpAnisotropy );

		}

		if ( m.mapNormal && texturePath ) {

			create_texture( mpars, 'normalMap', m.mapNormal, m.mapNormalRepeat, m.mapNormalOffset, m.mapNormalWrap, m.mapNormalAnisotropy );

		}

		if ( m.mapSpecular && texturePath ) {

			create_texture( mpars, 'specularMap', m.mapSpecular, m.mapSpecularRepeat, m.mapSpecularOffset, m.mapSpecularWrap, m.mapSpecularAnisotropy );

		}

		if ( m.mapAlpha && texturePath ) {

			create_texture( mpars, 'alphaMap', m.mapAlpha, m.mapAlphaRepeat, m.mapAlphaOffset, m.mapAlphaWrap, m.mapAlphaAnisotropy );

		}

		//

		if ( m.mapBumpScale ) {

			mpars.bumpScale = m.mapBumpScale;

		}

		// special case for normal mapped material

		if ( m.mapNormal ) {

			var shader = THREE.ShaderLib[ 'normalmap' ];
			var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

			uniforms[ 'tNormal' ].value = mpars.normalMap;

			if ( m.mapNormalFactor ) {

				uniforms[ 'uNormalScale' ].value.set( m.mapNormalFactor, m.mapNormalFactor );

			}

			if ( mpars.map ) {

				uniforms[ 'tDiffuse' ].value = mpars.map;
				uniforms[ 'enableDiffuse' ].value = true;

			}

			if ( mpars.specularMap ) {

				uniforms[ 'tSpecular' ].value = mpars.specularMap;
				uniforms[ 'enableSpecular' ].value = true;

			}

			if ( mpars.lightMap ) {

				uniforms[ 'tAO' ].value = mpars.lightMap;
				uniforms[ 'enableAO' ].value = true;

			}

			// for the moment don't handle displacement texture

			uniforms[ 'diffuse' ].value.setHex( mpars.color );
			uniforms[ 'specular' ].value.setHex( mpars.specular );
			uniforms[ 'ambient' ].value.setHex( mpars.ambient );

			uniforms[ 'shininess' ].value = mpars.shininess;

			if ( mpars.opacity !== undefined ) {

				uniforms[ 'opacity' ].value = mpars.opacity;

			}

			var parameters = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms, lights: true, fog: true };
			var material = new THREE.ShaderMaterial( parameters );

			if ( mpars.transparent ) {

				material.transparent = true;

			}

		} else {

			var material = new THREE[ mtype ]( mpars );

		}

		if ( m.DbgName !== undefined ) material.name = m.DbgName;

		return material;

	}

};

THREE.Loader.Handlers = {

	handlers: [],

	add: function ( regex, loader ) {

		this.handlers.push( regex, loader );

	},

	get: function ( file ) {

		for ( var i = 0, l = this.handlers.length; i < l; i += 2 ) {

			var regex = this.handlers[ i ];
			var loader  = this.handlers[ i + 1 ];

			if ( regex.test( file ) ) {

				return loader;

			}

		}

		return null;

	}

};

// File:src/loaders/XHRLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.XHRLoader = function ( manager ) {

	this.cache = new THREE.Cache();
	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.XHRLoader.prototype = {

	constructor: THREE.XHRLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var cached = scope.cache.get( url );

		if ( cached !== undefined ) {

			if ( onLoad ) onLoad( cached );
			return;

		}

		var request = new XMLHttpRequest();
		request.open( 'GET', url, true );

		request.addEventListener( 'load', function ( event ) {

			scope.cache.add( url, this.response );

			if ( onLoad ) onLoad( this.response );

			scope.manager.itemEnd( url );

		}, false );

		if ( onProgress !== undefined ) {

			request.addEventListener( 'progress', function ( event ) {

				onProgress( event );

			}, false );

		}

		if ( onError !== undefined ) {

			request.addEventListener( 'error', function ( event ) {

				onError( event );

			}, false );

		}

		if ( this.crossOrigin !== undefined ) request.crossOrigin = this.crossOrigin;
		if ( this.responseType !== undefined ) request.responseType = this.responseType;

		request.send( null );

		scope.manager.itemStart( url );

	},

	setResponseType: function ( value ) {

		this.responseType = value;

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	}

};

// File:src/loaders/ImageLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.ImageLoader = function ( manager ) {

	this.cache = new THREE.Cache();
	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.ImageLoader.prototype = {

	constructor: THREE.ImageLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var cached = scope.cache.get( url );

		if ( cached !== undefined ) {

			onLoad( cached );
			return;

		}

		var image = document.createElement( 'img' );

		if ( onLoad !== undefined ) {

			image.addEventListener( 'load', function ( event ) {

				scope.cache.add( url, this );

				onLoad( this );
				scope.manager.itemEnd( url );

			}, false );

		}

		if ( onProgress !== undefined ) {

			image.addEventListener( 'progress', function ( event ) {

				onProgress( event );

			}, false );

		}

		if ( onError !== undefined ) {

			image.addEventListener( 'error', function ( event ) {

				onError( event );

			}, false );

		}

		if ( this.crossOrigin !== undefined ) image.crossOrigin = this.crossOrigin;

		image.src = url;

		scope.manager.itemStart( url );

		return image;

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	}

}

// File:src/loaders/JSONLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.JSONLoader = function ( showStatus ) {

	THREE.Loader.call( this, showStatus );

	this.withCredentials = false;

};

THREE.JSONLoader.prototype = Object.create( THREE.Loader.prototype );

THREE.JSONLoader.prototype.load = function ( url, callback, texturePath ) {

	var scope = this;

	// todo: unify load API to for easier SceneLoader use

	texturePath = texturePath && ( typeof texturePath === 'string' ) ? texturePath : this.extractUrlBase( url );

	this.onLoadStart();
	this.loadAjaxJSON( this, url, callback, texturePath );

};

THREE.JSONLoader.prototype.loadAjaxJSON = function ( context, url, callback, texturePath, callbackProgress ) {

	var xhr = new XMLHttpRequest();

	var length = 0;

	xhr.onreadystatechange = function () {

		if ( xhr.readyState === xhr.DONE ) {

			if ( xhr.status === 200 || xhr.status === 0 ) {

				if ( xhr.responseText ) {

					var json = JSON.parse( xhr.responseText );

					if ( json.metadata !== undefined && json.metadata.type === 'scene' ) {

						console.error( 'THREE.JSONLoader: "' + url + '" seems to be a Scene. Use THREE.SceneLoader instead.' );
						return;

					}

					var result = context.parse( json, texturePath );
					callback( result.geometry, result.materials );

				} else {

					console.error( 'THREE.JSONLoader: "' + url + '" seems to be unreachable or the file is empty.' );

				}

				// in context of more complex asset initialization
				// do not block on single failed file
				// maybe should go even one more level up

				context.onLoadComplete();

			} else {

				console.error( 'THREE.JSONLoader: Couldn\'t load "' + url + '" (' + xhr.status + ')' );

			}

		} else if ( xhr.readyState === xhr.LOADING ) {

			if ( callbackProgress ) {

				if ( length === 0 ) {

					length = xhr.getResponseHeader( 'Content-Length' );

				}

				callbackProgress( { total: length, loaded: xhr.responseText.length } );

			}

		} else if ( xhr.readyState === xhr.HEADERS_RECEIVED ) {

			if ( callbackProgress !== undefined ) {

				length = xhr.getResponseHeader( 'Content-Length' );

			}

		}

	};

	xhr.open( 'GET', url, true );
	xhr.withCredentials = this.withCredentials;
	xhr.send( null );

};

THREE.JSONLoader.prototype.parse = function ( json, texturePath ) {

	var scope = this,
	geometry = new THREE.Geometry(),
	scale = ( json.scale !== undefined ) ? 1.0 / json.scale : 1.0;

	parseModel( scale );

	parseSkin();
	parseMorphing( scale );

	geometry.computeFaceNormals();
	geometry.computeBoundingSphere();

	function parseModel( scale ) {

		function isBitSet( value, position ) {

			return value & ( 1 << position );

		}

		var i, j, fi,

		offset, zLength,

		colorIndex, normalIndex, uvIndex, materialIndex,

		type,
		isQuad,
		hasMaterial,
		hasFaceVertexUv,
		hasFaceNormal, hasFaceVertexNormal,
		hasFaceColor, hasFaceVertexColor,

		vertex, face, faceA, faceB, color, hex, normal,

		uvLayer, uv, u, v,

		faces = json.faces,
		vertices = json.vertices,
		normals = json.normals,
		colors = json.colors,

		nUvLayers = 0;

		if ( json.uvs !== undefined ) {

			// disregard empty arrays

			for ( i = 0; i < json.uvs.length; i ++ ) {

				if ( json.uvs[ i ].length ) nUvLayers ++;

			}

			for ( i = 0; i < nUvLayers; i ++ ) {

				geometry.faceVertexUvs[ i ] = [];

			}

		}

		offset = 0;
		zLength = vertices.length;

		while ( offset < zLength ) {

			vertex = new THREE.Vector3();

			vertex.x = vertices[ offset ++ ] * scale;
			vertex.y = vertices[ offset ++ ] * scale;
			vertex.z = vertices[ offset ++ ] * scale;

			geometry.vertices.push( vertex );

		}

		offset = 0;
		zLength = faces.length;

		while ( offset < zLength ) {

			type = faces[ offset ++ ];


			isQuad              = isBitSet( type, 0 );
			hasMaterial         = isBitSet( type, 1 );
			hasFaceVertexUv     = isBitSet( type, 3 );
			hasFaceNormal       = isBitSet( type, 4 );
			hasFaceVertexNormal = isBitSet( type, 5 );
			hasFaceColor	     = isBitSet( type, 6 );
			hasFaceVertexColor  = isBitSet( type, 7 );

			// console.log("type", type, "bits", isQuad, hasMaterial, hasFaceVertexUv, hasFaceNormal, hasFaceVertexNormal, hasFaceColor, hasFaceVertexColor);

			if ( isQuad ) {

				faceA = new THREE.Face3();
				faceA.a = faces[ offset ];
				faceA.b = faces[ offset + 1 ];
				faceA.c = faces[ offset + 3 ];

				faceB = new THREE.Face3();
				faceB.a = faces[ offset + 1 ];
				faceB.b = faces[ offset + 2 ];
				faceB.c = faces[ offset + 3 ];

				offset += 4;

				if ( hasMaterial ) {

					materialIndex = faces[ offset ++ ];
					faceA.materialIndex = materialIndex;
					faceB.materialIndex = materialIndex;

				}

				// to get face <=> uv index correspondence

				fi = geometry.faces.length;

				if ( hasFaceVertexUv ) {

					for ( i = 0; i < nUvLayers; i ++ ) {

						uvLayer = json.uvs[ i ];

						geometry.faceVertexUvs[ i ][ fi ] = [];
						geometry.faceVertexUvs[ i ][ fi + 1 ] = []

						for ( j = 0; j < 4; j ++ ) {

							uvIndex = faces[ offset ++ ];

							u = uvLayer[ uvIndex * 2 ];
							v = uvLayer[ uvIndex * 2 + 1 ];

							uv = new THREE.Vector2( u, v );

							if ( j !== 2 ) geometry.faceVertexUvs[ i ][ fi ].push( uv );
							if ( j !== 0 ) geometry.faceVertexUvs[ i ][ fi + 1 ].push( uv );

						}

					}

				}

				if ( hasFaceNormal ) {

					normalIndex = faces[ offset ++ ] * 3;

					faceA.normal.set(
						normals[ normalIndex ++ ],
						normals[ normalIndex ++ ],
						normals[ normalIndex ]
					);

					faceB.normal.copy( faceA.normal );

				}

				if ( hasFaceVertexNormal ) {

					for ( i = 0; i < 4; i ++ ) {

						normalIndex = faces[ offset ++ ] * 3;

						normal = new THREE.Vector3(
							normals[ normalIndex ++ ],
							normals[ normalIndex ++ ],
							normals[ normalIndex ]
						);


						if ( i !== 2 ) faceA.vertexNormals.push( normal );
						if ( i !== 0 ) faceB.vertexNormals.push( normal );

					}

				}


				if ( hasFaceColor ) {

					colorIndex = faces[ offset ++ ];
					hex = colors[ colorIndex ];

					faceA.color.setHex( hex );
					faceB.color.setHex( hex );

				}


				if ( hasFaceVertexColor ) {

					for ( i = 0; i < 4; i ++ ) {

						colorIndex = faces[ offset ++ ];
						hex = colors[ colorIndex ];

						if ( i !== 2 ) faceA.vertexColors.push( new THREE.Color( hex ) );
						if ( i !== 0 ) faceB.vertexColors.push( new THREE.Color( hex ) );

					}

				}

				geometry.faces.push( faceA );
				geometry.faces.push( faceB );

			} else {

				face = new THREE.Face3();
				face.a = faces[ offset ++ ];
				face.b = faces[ offset ++ ];
				face.c = faces[ offset ++ ];

				if ( hasMaterial ) {

					materialIndex = faces[ offset ++ ];
					face.materialIndex = materialIndex;

				}

				// to get face <=> uv index correspondence

				fi = geometry.faces.length;

				if ( hasFaceVertexUv ) {

					for ( i = 0; i < nUvLayers; i ++ ) {

						uvLayer = json.uvs[ i ];

						geometry.faceVertexUvs[ i ][ fi ] = [];

						for ( j = 0; j < 3; j ++ ) {

							uvIndex = faces[ offset ++ ];

							u = uvLayer[ uvIndex * 2 ];
							v = uvLayer[ uvIndex * 2 + 1 ];

							uv = new THREE.Vector2( u, v );

							geometry.faceVertexUvs[ i ][ fi ].push( uv );

						}

					}

				}

				if ( hasFaceNormal ) {

					normalIndex = faces[ offset ++ ] * 3;

					face.normal.set(
						normals[ normalIndex ++ ],
						normals[ normalIndex ++ ],
						normals[ normalIndex ]
					);

				}

				if ( hasFaceVertexNormal ) {

					for ( i = 0; i < 3; i ++ ) {

						normalIndex = faces[ offset ++ ] * 3;

						normal = new THREE.Vector3(
							normals[ normalIndex ++ ],
							normals[ normalIndex ++ ],
							normals[ normalIndex ]
						);

						face.vertexNormals.push( normal );

					}

				}


				if ( hasFaceColor ) {

					colorIndex = faces[ offset ++ ];
					face.color.setHex( colors[ colorIndex ] );

				}


				if ( hasFaceVertexColor ) {

					for ( i = 0; i < 3; i ++ ) {

						colorIndex = faces[ offset ++ ];
						face.vertexColors.push( new THREE.Color( colors[ colorIndex ] ) );

					}

				}

				geometry.faces.push( face );

			}

		}

	};

	function parseSkin() {
		var influencesPerVertex = ( json.influencesPerVertex !== undefined ) ? json.influencesPerVertex : 2;

		if ( json.skinWeights ) {

			for ( var i = 0, l = json.skinWeights.length; i < l; i += influencesPerVertex ) {

				var x =                               json.skinWeights[ i     ];
				var y = ( influencesPerVertex > 1 ) ? json.skinWeights[ i + 1 ] : 0;
				var z = ( influencesPerVertex > 2 ) ? json.skinWeights[ i + 2 ] : 0;
				var w = ( influencesPerVertex > 3 ) ? json.skinWeights[ i + 3 ] : 0;

				geometry.skinWeights.push( new THREE.Vector4( x, y, z, w ) );

			}

		}

		if ( json.skinIndices ) {

			for ( var i = 0, l = json.skinIndices.length; i < l; i += influencesPerVertex ) {

				var a =                               json.skinIndices[ i     ];
				var b = ( influencesPerVertex > 1 ) ? json.skinIndices[ i + 1 ] : 0;
				var c = ( influencesPerVertex > 2 ) ? json.skinIndices[ i + 2 ] : 0;
				var d = ( influencesPerVertex > 3 ) ? json.skinIndices[ i + 3 ] : 0;

				geometry.skinIndices.push( new THREE.Vector4( a, b, c, d ) );

			}

		}

		geometry.bones = json.bones;

		if ( geometry.bones && geometry.bones.length > 0 && ( geometry.skinWeights.length !== geometry.skinIndices.length || geometry.skinIndices.length !== geometry.vertices.length ) ) {

				console.warn( 'When skinning, number of vertices (' + geometry.vertices.length + '), skinIndices (' +
					geometry.skinIndices.length + '), and skinWeights (' + geometry.skinWeights.length + ') should match.' );

		}


		// could change this to json.animations[0] or remove completely

		geometry.animation = json.animation;
		geometry.animations = json.animations;

	};

	function parseMorphing( scale ) {

		if ( json.morphTargets !== undefined ) {

			var i, l, v, vl, dstVertices, srcVertices;

			for ( i = 0, l = json.morphTargets.length; i < l; i ++ ) {

				geometry.morphTargets[ i ] = {};
				geometry.morphTargets[ i ].name = json.morphTargets[ i ].name;
				geometry.morphTargets[ i ].vertices = [];

				dstVertices = geometry.morphTargets[ i ].vertices;
				srcVertices = json.morphTargets [ i ].vertices;

				for ( v = 0, vl = srcVertices.length; v < vl; v += 3 ) {

					var vertex = new THREE.Vector3();
					vertex.x = srcVertices[ v ] * scale;
					vertex.y = srcVertices[ v + 1 ] * scale;
					vertex.z = srcVertices[ v + 2 ] * scale;

					dstVertices.push( vertex );

				}

			}

		}

		if ( json.morphColors !== undefined ) {

			var i, l, c, cl, dstColors, srcColors, color;

			for ( i = 0, l = json.morphColors.length; i < l; i ++ ) {

				geometry.morphColors[ i ] = {};
				geometry.morphColors[ i ].name = json.morphColors[ i ].name;
				geometry.morphColors[ i ].colors = [];

				dstColors = geometry.morphColors[ i ].colors;
				srcColors = json.morphColors [ i ].colors;

				for ( c = 0, cl = srcColors.length; c < cl; c += 3 ) {

					color = new THREE.Color( 0xffaa00 );
					color.setRGB( srcColors[ c ], srcColors[ c + 1 ], srcColors[ c + 2 ] );
					dstColors.push( color );

				}

			}

		}

	};

	if ( json.materials === undefined || json.materials.length === 0 ) {

		return { geometry: geometry };

	} else {

		var materials = this.initMaterials( json.materials, texturePath );

		if ( this.needsTangents( materials ) ) {

			geometry.computeTangents();

		}

		return { geometry: geometry, materials: materials };

	}

};

// File:src/loaders/LoadingManager.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.LoadingManager = function ( onLoad, onProgress, onError ) {

	var scope = this;

	var loaded = 0, total = 0;

	this.onLoad = onLoad;
	this.onProgress = onProgress;
	this.onError = onError;

	this.itemStart = function ( url ) {

		total ++;

	};

	this.itemEnd = function ( url ) {

		loaded ++;

		if ( scope.onProgress !== undefined ) {

			scope.onProgress( url, loaded, total );

		}

		if ( loaded === total && scope.onLoad !== undefined ) {

			scope.onLoad();

		}

	};

};

THREE.DefaultLoadingManager = new THREE.LoadingManager();

// File:src/loaders/BufferGeometryLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.BufferGeometryLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.BufferGeometryLoader.prototype = {

	constructor: THREE.BufferGeometryLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader();
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( JSON.parse( text ) ) );

		}, onProgress, onError );

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	parse: function ( json ) {

		var geometry = new THREE.BufferGeometry();

		var attributes = json.attributes;

		for ( var key in attributes ) {

			var attribute = attributes[ key ];
			var typedArray = new self[ attribute.type ]( attribute.array );

			geometry.addAttribute( key, new THREE.BufferAttribute( typedArray, attribute.itemSize ) );

		}

		var offsets = json.offsets;

		if ( offsets !== undefined ) {

			geometry.offsets = JSON.parse( JSON.stringify( offsets ) );

		}

		var boundingSphere = json.boundingSphere;

		if ( boundingSphere !== undefined ) {

			var center = new THREE.Vector3();

			if ( boundingSphere.center !== undefined ) {

				center.fromArray( boundingSphere.center );

			}

			geometry.boundingSphere = new THREE.Sphere( center, boundingSphere.radius );

		}

		return geometry;

	}

};

// File:src/loaders/MaterialLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.MaterialLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.MaterialLoader.prototype = {

	constructor: THREE.MaterialLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader();
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( JSON.parse( text ) ) );

		}, onProgress, onError );

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	parse: function ( json ) {

		var material = new THREE[ json.type ];

		if ( json.color !== undefined ) material.color.setHex( json.color );
		if ( json.ambient !== undefined ) material.ambient.setHex( json.ambient );
		if ( json.emissive !== undefined ) material.emissive.setHex( json.emissive );
		if ( json.specular !== undefined ) material.specular.setHex( json.specular );
		if ( json.shininess !== undefined ) material.shininess = json.shininess;
		if ( json.uniforms !== undefined ) material.uniforms = json.uniforms;
		if ( json.vertexShader !== undefined ) material.vertexShader = json.vertexShader;
		if ( json.fragmentShader !== undefined ) material.fragmentShader = json.fragmentShader;		
		if ( json.vertexColors !== undefined ) material.vertexColors = json.vertexColors;
		if ( json.shading !== undefined ) material.shading = json.shading;
		if ( json.blending !== undefined ) material.blending = json.blending;
		if ( json.side !== undefined ) material.side = json.side;
		if ( json.opacity !== undefined ) material.opacity = json.opacity;
		if ( json.transparent !== undefined ) material.transparent = json.transparent;
		if ( json.wireframe !== undefined ) material.wireframe = json.wireframe;

		if ( json.materials !== undefined ) {

			for ( var i = 0, l = json.materials.length; i < l; i ++ ) {

				material.materials.push( this.parse( json.materials[ i ] ) );

			}

		}

		return material;

	}

};

// File:src/loaders/ObjectLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.ObjectLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.ObjectLoader.prototype = {

	constructor: THREE.ObjectLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( JSON.parse( text ) ) );

		}, onProgress, onError );

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	parse: function ( json ) {

		var geometries = this.parseGeometries( json.geometries );
		var materials = this.parseMaterials( json.materials );
		var object = this.parseObject( json.object, geometries, materials );

		return object;

	},

	parseGeometries: function ( json ) {

		var geometries = {};

		if ( json !== undefined ) {

			var geometryLoader = new THREE.JSONLoader();
			var bufferGeometryLoader = new THREE.BufferGeometryLoader();

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var geometry;
				var data = json[ i ];

				switch ( data.type ) {

					case 'PlaneGeometry':

						geometry = new THREE.PlaneGeometry(
							data.width,
							data.height,
							data.widthSegments,
							data.heightSegments
						);

						break;

					case 'BoxGeometry':
					case 'CubeGeometry': // backwards compatible

						geometry = new THREE.BoxGeometry(
							data.width,
							data.height,
							data.depth,
							data.widthSegments,
							data.heightSegments,
							data.depthSegments
						);

						break;

					case 'CircleGeometry':

						geometry = new THREE.CircleGeometry(
							data.radius,
							data.segments
						);

						break;

					case 'CylinderGeometry':

						geometry = new THREE.CylinderGeometry(
							data.radiusTop,
							data.radiusBottom,
							data.height,
							data.radialSegments,
							data.heightSegments,
							data.openEnded
						);

						break;

					case 'SphereGeometry':

						geometry = new THREE.SphereGeometry(
							data.radius,
							data.widthSegments,
							data.heightSegments,
							data.phiStart,
							data.phiLength,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'IcosahedronGeometry':

						geometry = new THREE.IcosahedronGeometry(
							data.radius,
							data.detail
						);

						break;

					case 'TorusGeometry':

						geometry = new THREE.TorusGeometry(
							data.radius,
							data.tube,
							data.radialSegments,
							data.tubularSegments,
							data.arc
						);

						break;

					case 'TorusKnotGeometry':

						geometry = new THREE.TorusKnotGeometry(
							data.radius,
							data.tube,
							data.radialSegments,
							data.tubularSegments,
							data.p,
							data.q,
							data.heightScale
						);

						break;

					case 'BufferGeometry':

						geometry = bufferGeometryLoader.parse( data.data );

						break;

					case 'Geometry':

						geometry = geometryLoader.parse( data.data ).geometry;

						break;

				}

				geometry.uuid = data.uuid;

				if ( data.name !== undefined ) geometry.name = data.name;

				geometries[ data.uuid ] = geometry;

			}

		}

		return geometries;

	},

	parseMaterials: function ( json ) {

		var materials = {};

		if ( json !== undefined ) {

			var loader = new THREE.MaterialLoader();

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var data = json[ i ];
				var material = loader.parse( data );

				material.uuid = data.uuid;

				if ( data.name !== undefined ) material.name = data.name;

				materials[ data.uuid ] = material;

			}

		}

		return materials;

	},

	parseObject: function () {

		var matrix = new THREE.Matrix4();

		return function ( data, geometries, materials ) {

			var object;

			switch ( data.type ) {

				case 'Scene':

					object = new THREE.Scene();

					break;

				case 'PerspectiveCamera':

					object = new THREE.PerspectiveCamera( data.fov, data.aspect, data.near, data.far );

					break;

				case 'OrthographicCamera':

					object = new THREE.OrthographicCamera( data.left, data.right, data.top, data.bottom, data.near, data.far );

					break;

				case 'AmbientLight':

					object = new THREE.AmbientLight( data.color );

					break;

				case 'DirectionalLight':

					object = new THREE.DirectionalLight( data.color, data.intensity );

					break;

				case 'PointLight':

					object = new THREE.PointLight( data.color, data.intensity, data.distance );

					break;

				case 'SpotLight':

					object = new THREE.SpotLight( data.color, data.intensity, data.distance, data.angle, data.exponent );

					break;

				case 'HemisphereLight':

					object = new THREE.HemisphereLight( data.color, data.groundColor, data.intensity );

					break;

				case 'Mesh':

					var geometry = geometries[ data.geometry ];
					var material = materials[ data.material ];

					if ( geometry === undefined ) {

						console.warn( 'THREE.ObjectLoader: Undefined geometry', data.geometry );

					}

					if ( material === undefined ) {

						console.warn( 'THREE.ObjectLoader: Undefined material', data.material );

					}

					object = new THREE.Mesh( geometry, material );

					break;

				case 'Line':

					var geometry = geometries[ data.geometry ];
					var material = materials[ data.material ];

					if ( geometry === undefined ) {

						console.warn( 'THREE.ObjectLoader: Undefined geometry', data.geometry );

					}

					if ( material === undefined ) {

						console.warn( 'THREE.ObjectLoader: Undefined material', data.material );

					}

					object = new THREE.Line( geometry, material );

					break;

				case 'Sprite':

					var material = materials[ data.material ];

					if ( material === undefined ) {

						console.warn( 'THREE.ObjectLoader: Undefined material', data.material );

					}

					object = new THREE.Sprite( material );

					break;

				case 'Group':

					object = new THREE.Group();

					break;

				default:

					object = new THREE.Object3D();

			}

			object.uuid = data.uuid;

			if ( data.name !== undefined ) object.name = data.name;
			if ( data.matrix !== undefined ) {

				matrix.fromArray( data.matrix );
				matrix.decompose( object.position, object.quaternion, object.scale );

			} else {

				if ( data.position !== undefined ) object.position.fromArray( data.position );
				if ( data.rotation !== undefined ) object.rotation.fromArray( data.rotation );
				if ( data.scale !== undefined ) object.scale.fromArray( data.scale );

			}

			if ( data.visible !== undefined ) object.visible = data.visible;
			if ( data.userData !== undefined ) object.userData = data.userData;

			if ( data.children !== undefined ) {

				for ( var child in data.children ) {

					object.add( this.parseObject( data.children[ child ], geometries, materials ) );

				}

			}

			return object;

		}

	}()

};

// File:src/loaders/TextureLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.TextureLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.TextureLoader.prototype = {

	constructor: THREE.TextureLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.ImageLoader( scope.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( image ) {

			var texture = new THREE.Texture( image );
			texture.needsUpdate = true;

			if ( onLoad !== undefined ) {

				onLoad( texture );

			}

		}, onProgress, onError );

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	}

};

// File:src/loaders/CompressedTextureLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 *
 * Abstract Base class to block based textures loader (dds, pvr, ...)
 */

THREE.CompressedTextureLoader = function () {

	// override in sub classes
	this._parser = null;

};


THREE.CompressedTextureLoader.prototype = {

	constructor: THREE.CompressedTextureLoader,

	load: function ( url, onLoad, onError ) {

		var scope = this;

		var images = [];

		var texture = new THREE.CompressedTexture();
		texture.image = images;

		var loader = new THREE.XHRLoader();
		loader.setResponseType( 'arraybuffer' );

		if ( url instanceof Array ) {

			var loaded = 0;

			var loadTexture = function ( i ) {

				loader.load( url[ i ], function ( buffer ) {

					var texDatas = scope._parser( buffer, true );

					images[ i ] = {
						width: texDatas.width,
						height: texDatas.height,
						format: texDatas.format,
						mipmaps: texDatas.mipmaps
					};

					loaded += 1;

					if ( loaded === 6 ) {

 						if (texDatas.mipmapCount == 1)
 							texture.minFilter = THREE.LinearFilter;

						texture.format = texDatas.format;
						texture.needsUpdate = true;

						if ( onLoad ) onLoad( texture );

					}

				} );

			};

			for ( var i = 0, il = url.length; i < il; ++ i ) {

				loadTexture( i );

			}

		} else {

			// compressed cubemap texture stored in a single DDS file

			loader.load( url, function ( buffer ) {

				var texDatas = scope._parser( buffer, true );

				if ( texDatas.isCubemap ) {

					var faces = texDatas.mipmaps.length / texDatas.mipmapCount;

					for ( var f = 0; f < faces; f ++ ) {

						images[ f ] = { mipmaps : [] };

						for ( var i = 0; i < texDatas.mipmapCount; i ++ ) {

							images[ f ].mipmaps.push( texDatas.mipmaps[ f * texDatas.mipmapCount + i ] );
							images[ f ].format = texDatas.format;
							images[ f ].width = texDatas.width;
							images[ f ].height = texDatas.height;

						}

					}

				} else {

					texture.image.width = texDatas.width;
					texture.image.height = texDatas.height;
					texture.mipmaps = texDatas.mipmaps;

				}

				if ( texDatas.mipmapCount === 1 ) {

					texture.minFilter = THREE.LinearFilter;

				}

				texture.format = texDatas.format;
				texture.needsUpdate = true;

				if ( onLoad ) onLoad( texture );

			} );

		}

		return texture;

	}

};

// File:src/materials/Material.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Material = function () {

	Object.defineProperty( this, 'id', { value: THREE.MaterialIdCount ++ } );

	this.uuid = THREE.Math.generateUUID();

	this.name = '';
	this.type = 'Material';

	this.side = THREE.FrontSide;

	this.opacity = 1;
	this.transparent = false;

	this.blending = THREE.NormalBlending;

	this.blendSrc = THREE.SrcAlphaFactor;
	this.blendDst = THREE.OneMinusSrcAlphaFactor;
	this.blendEquation = THREE.AddEquation;

	this.depthTest = true;
	this.depthWrite = true;

	this.polygonOffset = false;
	this.polygonOffsetFactor = 0;
	this.polygonOffsetUnits = 0;

	this.alphaTest = 0;

	this.overdraw = 0; // Overdrawn pixels (typically between 0 and 1) for fixing antialiasing gaps in CanvasRenderer

	this.visible = true;

	this.needsUpdate = true;

};

THREE.Material.prototype = {

	constructor: THREE.Material,

	setValues: function ( values ) {

		if ( values === undefined ) return;

		for ( var key in values ) {

			var newValue = values[ key ];

			if ( newValue === undefined ) {

				console.warn( "THREE.Material: '" + key + "' parameter is undefined." );
				continue;

			}

			if ( key in this ) {

				var currentValue = this[ key ];

				if ( currentValue instanceof THREE.Color ) {

					currentValue.set( newValue );

				} else if ( currentValue instanceof THREE.Vector3 && newValue instanceof THREE.Vector3 ) {

					currentValue.copy( newValue );

				} else if ( key == 'overdraw' ) {

					// ensure overdraw is backwards-compatable with legacy boolean type
					this[ key ] = Number( newValue );

				} else {

					this[ key ] = newValue;

				}

			}

		}

	},

	toJSON: function () {

		var output = {
			metadata: {
				version: 4.2,
				type: 'material',
				generator: 'MaterialExporter'
			},
			uuid: this.uuid,
			type: this.type
		};

		if ( this.name !== "" ) output.name = this.name;

		if ( this instanceof THREE.MeshBasicMaterial ) {

			output.color = this.color.getHex();
			if ( this.vertexColors !== THREE.NoColors ) output.vertexColors = this.vertexColors;
			if ( this.blending !== THREE.NormalBlending ) output.blending = this.blending;
			if ( this.side !== THREE.FrontSide ) output.side = this.side;

		} else if ( this instanceof THREE.MeshLambertMaterial ) {

			output.color = this.color.getHex();
			output.ambient = this.ambient.getHex();
			output.emissive = this.emissive.getHex();
			if ( this.vertexColors !== THREE.NoColors ) output.vertexColors = this.vertexColors;
			if ( this.blending !== THREE.NormalBlending ) output.blending = this.blending;
			if ( this.side !== THREE.FrontSide ) output.side = this.side;

		} else if ( this instanceof THREE.MeshPhongMaterial ) {

			output.color = this.color.getHex();
			output.ambient = this.ambient.getHex();
			output.emissive = this.emissive.getHex();
			output.specular = this.specular.getHex();
			output.shininess = this.shininess;
			if ( this.vertexColors !== THREE.NoColors ) output.vertexColors = this.vertexColors;
			if ( this.blending !== THREE.NormalBlending ) output.blending = this.blending;
			if ( this.side !== THREE.FrontSide ) output.side = this.side;

		} else if ( this instanceof THREE.MeshNormalMaterial ) {

			if ( this.shading !== THREE.FlatShading ) output.shading = this.shading;
			if ( this.blending !== THREE.NormalBlending ) output.blending = this.blending;
			if ( this.side !== THREE.FrontSide ) output.side = this.side;

		} else if ( this instanceof THREE.MeshDepthMaterial ) {

			if ( this.blending !== THREE.NormalBlending ) output.blending = this.blending;
			if ( this.side !== THREE.FrontSide ) output.side = this.side;

		} else if ( this instanceof THREE.ShaderMaterial ) {

			output.uniforms = this.uniforms;
			output.vertexShader = this.vertexShader;
			output.fragmentShader = this.fragmentShader;

		} else if ( this instanceof THREE.SpriteMaterial ) {

			output.color = this.color.getHex();

		}

		if ( this.opacity < 1 ) output.opacity = this.opacity;
		if ( this.transparent !== false ) output.transparent = this.transparent;
		if ( this.wireframe !== false ) output.wireframe = this.wireframe;

		return output;

	},

	clone: function ( material ) {

		if ( material === undefined ) material = new THREE.Material();

		material.name = this.name;

		material.side = this.side;

		material.opacity = this.opacity;
		material.transparent = this.transparent;

		material.blending = this.blending;

		material.blendSrc = this.blendSrc;
		material.blendDst = this.blendDst;
		material.blendEquation = this.blendEquation;

		material.depthTest = this.depthTest;
		material.depthWrite = this.depthWrite;

		material.polygonOffset = this.polygonOffset;
		material.polygonOffsetFactor = this.polygonOffsetFactor;
		material.polygonOffsetUnits = this.polygonOffsetUnits;

		material.alphaTest = this.alphaTest;

		material.overdraw = this.overdraw;

		material.visible = this.visible;

		return material;

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

};

THREE.EventDispatcher.prototype.apply( THREE.Material.prototype );

THREE.MaterialIdCount = 0;

// File:src/materials/LineBasicMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  linewidth: <float>,
 *  linecap: "round",
 *  linejoin: "round",
 *
 *  vertexColors: <bool>
 *
 *  fog: <bool>
 * }
 */

THREE.LineBasicMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'LineBasicMaterial';

	this.color = new THREE.Color( 0xffffff );

	this.linewidth = 1;
	this.linecap = 'round';
	this.linejoin = 'round';

	this.vertexColors = THREE.NoColors;

	this.fog = true;

	this.setValues( parameters );

};

THREE.LineBasicMaterial.prototype = Object.create( THREE.Material.prototype );

THREE.LineBasicMaterial.prototype.clone = function () {

	var material = new THREE.LineBasicMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.color.copy( this.color );

	material.linewidth = this.linewidth;
	material.linecap = this.linecap;
	material.linejoin = this.linejoin;

	material.vertexColors = this.vertexColors;

	material.fog = this.fog;

	return material;

};

// File:src/materials/LineDashedMaterial.js

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  linewidth: <float>,
 *
 *  scale: <float>,
 *  dashSize: <float>,
 *  gapSize: <float>,
 *
 *  vertexColors: <bool>
 *
 *  fog: <bool>
 * }
 */

THREE.LineDashedMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'LineDashedMaterial';

	this.color = new THREE.Color( 0xffffff );

	this.linewidth = 1;

	this.scale = 1;
	this.dashSize = 3;
	this.gapSize = 1;

	this.vertexColors = false;

	this.fog = true;

	this.setValues( parameters );

};

THREE.LineDashedMaterial.prototype = Object.create( THREE.Material.prototype );

THREE.LineDashedMaterial.prototype.clone = function () {

	var material = new THREE.LineDashedMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.color.copy( this.color );

	material.linewidth = this.linewidth;

	material.scale = this.scale;
	material.dashSize = this.dashSize;
	material.gapSize = this.gapSize;

	material.vertexColors = this.vertexColors;

	material.fog = this.fog;

	return material;

};

// File:src/materials/MeshBasicMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *  lightMap: new THREE.Texture( <Image> ),
 *
 *  specularMap: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
 *  combine: THREE.Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  shading: THREE.SmoothShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  vertexColors: THREE.NoColors / THREE.VertexColors / THREE.FaceColors,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *
 *  fog: <bool>
 * }
 */

THREE.MeshBasicMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'MeshBasicMaterial';

	this.color = new THREE.Color( 0xffffff ); // emissive

	this.map = null;

	this.lightMap = null;

	this.specularMap = null;

	this.alphaMap = null;

	this.envMap = null;
	this.combine = THREE.MultiplyOperation;
	this.reflectivity = 1;
	this.refractionRatio = 0.98;

	this.fog = true;

	this.shading = THREE.SmoothShading;

	this.wireframe = false;
	this.wireframeLinewidth = 1;
	this.wireframeLinecap = 'round';
	this.wireframeLinejoin = 'round';

	this.vertexColors = THREE.NoColors;

	this.skinning = false;
	this.morphTargets = false;

	this.setValues( parameters );

};

THREE.MeshBasicMaterial.prototype = Object.create( THREE.Material.prototype );

THREE.MeshBasicMaterial.prototype.clone = function () {

	var material = new THREE.MeshBasicMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.color.copy( this.color );

	material.map = this.map;

	material.lightMap = this.lightMap;

	material.specularMap = this.specularMap;

	material.alphaMap = this.alphaMap;

	material.envMap = this.envMap;
	material.combine = this.combine;
	material.reflectivity = this.reflectivity;
	material.refractionRatio = this.refractionRatio;

	material.fog = this.fog;

	material.shading = this.shading;

	material.wireframe = this.wireframe;
	material.wireframeLinewidth = this.wireframeLinewidth;
	material.wireframeLinecap = this.wireframeLinecap;
	material.wireframeLinejoin = this.wireframeLinejoin;

	material.vertexColors = this.vertexColors;

	material.skinning = this.skinning;
	material.morphTargets = this.morphTargets;

	return material;

};

// File:src/materials/MeshLambertMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  ambient: <hex>,
 *  emissive: <hex>,
 *  opacity: <float>,
 *
 *  map: new THREE.Texture( <Image> ),
 *
 *  lightMap: new THREE.Texture( <Image> ),
 *
 *  specularMap: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
 *  combine: THREE.Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  shading: THREE.SmoothShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  vertexColors: THREE.NoColors / THREE.VertexColors / THREE.FaceColors,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>,
 *
 *	fog: <bool>
 * }
 */

THREE.MeshLambertMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'MeshLambertMaterial';

	this.color = new THREE.Color( 0xffffff ); // diffuse
	this.ambient = new THREE.Color( 0xffffff );
	this.emissive = new THREE.Color( 0x000000 );

	this.wrapAround = false;
	this.wrapRGB = new THREE.Vector3( 1, 1, 1 );

	this.map = null;

	this.lightMap = null;

	this.specularMap = null;

	this.alphaMap = null;

	this.envMap = null;
	this.combine = THREE.MultiplyOperation;
	this.reflectivity = 1;
	this.refractionRatio = 0.98;

	this.fog = true;

	this.shading = THREE.SmoothShading;

	this.wireframe = false;
	this.wireframeLinewidth = 1;
	this.wireframeLinecap = 'round';
	this.wireframeLinejoin = 'round';

	this.vertexColors = THREE.NoColors;

	this.skinning = false;
	this.morphTargets = false;
	this.morphNormals = false;

	this.setValues( parameters );

};

THREE.MeshLambertMaterial.prototype = Object.create( THREE.Material.prototype );

THREE.MeshLambertMaterial.prototype.clone = function () {

	var material = new THREE.MeshLambertMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.color.copy( this.color );
	material.ambient.copy( this.ambient );
	material.emissive.copy( this.emissive );

	material.wrapAround = this.wrapAround;
	material.wrapRGB.copy( this.wrapRGB );

	material.map = this.map;

	material.lightMap = this.lightMap;

	material.specularMap = this.specularMap;

	material.alphaMap = this.alphaMap;

	material.envMap = this.envMap;
	material.combine = this.combine;
	material.reflectivity = this.reflectivity;
	material.refractionRatio = this.refractionRatio;

	material.fog = this.fog;

	material.shading = this.shading;

	material.wireframe = this.wireframe;
	material.wireframeLinewidth = this.wireframeLinewidth;
	material.wireframeLinecap = this.wireframeLinecap;
	material.wireframeLinejoin = this.wireframeLinejoin;

	material.vertexColors = this.vertexColors;

	material.skinning = this.skinning;
	material.morphTargets = this.morphTargets;
	material.morphNormals = this.morphNormals;

	return material;

};

// File:src/materials/MeshPhongMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  ambient: <hex>,
 *  emissive: <hex>,
 *  specular: <hex>,
 *  shininess: <float>,
 *  opacity: <float>,
 *
 *  map: new THREE.Texture( <Image> ),
 *
 *  lightMap: new THREE.Texture( <Image> ),
 *
 *  bumpMap: new THREE.Texture( <Image> ),
 *  bumpScale: <float>,
 *
 *  normalMap: new THREE.Texture( <Image> ),
 *  normalScale: <Vector2>,
 *
 *  specularMap: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
 *  combine: THREE.Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  shading: THREE.SmoothShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  vertexColors: THREE.NoColors / THREE.VertexColors / THREE.FaceColors,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>,
 *
 *	fog: <bool>
 * }
 */

THREE.MeshPhongMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'MeshPhongMaterial';

	this.color = new THREE.Color( 0xffffff ); // diffuse
	this.ambient = new THREE.Color( 0xffffff );
	this.emissive = new THREE.Color( 0x000000 );
	this.specular = new THREE.Color( 0x111111 );
	this.shininess = 30;

	this.metal = false;

	this.wrapAround = false;
	this.wrapRGB = new THREE.Vector3( 1, 1, 1 );

	this.map = null;

	this.lightMap = null;

	this.bumpMap = null;
	this.bumpScale = 1;

	this.normalMap = null;
	this.normalScale = new THREE.Vector2( 1, 1 );

	this.specularMap = null;

	this.alphaMap = null;

	this.envMap = null;
	this.combine = THREE.MultiplyOperation;
	this.reflectivity = 1;
	this.refractionRatio = 0.98;

	this.fog = true;

	this.shading = THREE.SmoothShading;

	this.wireframe = false;
	this.wireframeLinewidth = 1;
	this.wireframeLinecap = 'round';
	this.wireframeLinejoin = 'round';

	this.vertexColors = THREE.NoColors;

	this.skinning = false;
	this.morphTargets = false;
	this.morphNormals = false;

	this.setValues( parameters );

};

THREE.MeshPhongMaterial.prototype = Object.create( THREE.Material.prototype );

THREE.MeshPhongMaterial.prototype.clone = function () {

	var material = new THREE.MeshPhongMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.color.copy( this.color );
	material.ambient.copy( this.ambient );
	material.emissive.copy( this.emissive );
	material.specular.copy( this.specular );
	material.shininess = this.shininess;

	material.metal = this.metal;

	material.wrapAround = this.wrapAround;
	material.wrapRGB.copy( this.wrapRGB );

	material.map = this.map;

	material.lightMap = this.lightMap;

	material.bumpMap = this.bumpMap;
	material.bumpScale = this.bumpScale;

	material.normalMap = this.normalMap;
	material.normalScale.copy( this.normalScale );

	material.specularMap = this.specularMap;

	material.alphaMap = this.alphaMap;

	material.envMap = this.envMap;
	material.combine = this.combine;
	material.reflectivity = this.reflectivity;
	material.refractionRatio = this.refractionRatio;

	material.fog = this.fog;

	material.shading = this.shading;

	material.wireframe = this.wireframe;
	material.wireframeLinewidth = this.wireframeLinewidth;
	material.wireframeLinecap = this.wireframeLinecap;
	material.wireframeLinejoin = this.wireframeLinejoin;

	material.vertexColors = this.vertexColors;

	material.skinning = this.skinning;
	material.morphTargets = this.morphTargets;
	material.morphNormals = this.morphNormals;

	return material;

};

// File:src/materials/MeshDepthMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  opacity: <float>,
 *
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>
 * }
 */

THREE.MeshDepthMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'MeshDepthMaterial';

	this.morphTargets = false;
	this.wireframe = false;
	this.wireframeLinewidth = 1;

	this.setValues( parameters );

};

THREE.MeshDepthMaterial.prototype = Object.create( THREE.Material.prototype );

THREE.MeshDepthMaterial.prototype.clone = function () {

	var material = new THREE.MeshDepthMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.wireframe = this.wireframe;
	material.wireframeLinewidth = this.wireframeLinewidth;

	return material;

};

// File:src/materials/MeshNormalMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 *
 * parameters = {
 *  opacity: <float>,
 *
 *  shading: THREE.FlatShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>
 * }
 */

THREE.MeshNormalMaterial = function ( parameters ) {

	THREE.Material.call( this, parameters );

	this.type = 'MeshNormalMaterial';

	this.shading = THREE.FlatShading;

	this.wireframe = false;
	this.wireframeLinewidth = 1;

	this.morphTargets = false;

	this.setValues( parameters );

};

THREE.MeshNormalMaterial.prototype = Object.create( THREE.Material.prototype );

THREE.MeshNormalMaterial.prototype.clone = function () {

	var material = new THREE.MeshNormalMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.shading = this.shading;

	material.wireframe = this.wireframe;
	material.wireframeLinewidth = this.wireframeLinewidth;

	return material;

};

// File:src/materials/MeshFaceMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.MeshFaceMaterial = function ( materials ) {

	this.uuid = THREE.Math.generateUUID();

	this.type = 'MeshFaceMaterial';
	
	this.materials = materials instanceof Array ? materials : [];

};

THREE.MeshFaceMaterial.prototype = {

	constructor: THREE.MeshFaceMaterial,

	toJSON: function () {

		var output = {
			metadata: {
				version: 4.2,
				type: 'material',
				generator: 'MaterialExporter'
			},
			uuid: this.uuid,
			type: this.type,
			materials: []
		};

		for ( var i = 0, l = this.materials.length; i < l; i ++ ) {

			output.materials.push( this.materials[ i ].toJSON() );

		}

		return output;

	},

	clone: function () {

		var material = new THREE.MeshFaceMaterial();

		for ( var i = 0; i < this.materials.length; i ++ ) {

			material.materials.push( this.materials[ i ].clone() );

		}

		return material;

	}

};

// File:src/materials/PointCloudMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *  size: <float>,
 *
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  vertexColors: <bool>,
 *
 *  fog: <bool>
 * }
 */

THREE.PointCloudMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'PointCloudMaterial';

	this.color = new THREE.Color( 0xffffff );

	this.map = null;

	this.size = 1;
	this.sizeAttenuation = true;

	this.vertexColors = THREE.NoColors;

	this.fog = true;

	this.setValues( parameters );

};

THREE.PointCloudMaterial.prototype = Object.create( THREE.Material.prototype );

THREE.PointCloudMaterial.prototype.clone = function () {

	var material = new THREE.PointCloudMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.color.copy( this.color );

	material.map = this.map;

	material.size = this.size;
	material.sizeAttenuation = this.sizeAttenuation;

	material.vertexColors = this.vertexColors;

	material.fog = this.fog;

	return material;

};

// backwards compatibility

THREE.ParticleBasicMaterial = function ( parameters ) {

	console.warn( 'THREE.ParticleBasicMaterial has been renamed to THREE.PointCloudMaterial.' );
	return new THREE.PointCloudMaterial( parameters );

};

THREE.ParticleSystemMaterial = function ( parameters ) {

	console.warn( 'THREE.ParticleSystemMaterial has been renamed to THREE.PointCloudMaterial.' );
	return new THREE.PointCloudMaterial( parameters );

};

// File:src/materials/ShaderMaterial.js

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  defines: { "label" : "value" },
 *  uniforms: { "parameter1": { type: "f", value: 1.0 }, "parameter2": { type: "i" value2: 2 } },
 *
 *  fragmentShader: <string>,
 *  vertexShader: <string>,
 *
 *  shading: THREE.SmoothShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  lights: <bool>,
 *
 *  vertexColors: THREE.NoColors / THREE.VertexColors / THREE.FaceColors,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>,
 *
 *	fog: <bool>
 * }
 */

THREE.ShaderMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'ShaderMaterial';

	this.defines = {};
	this.uniforms = {};
	this.attributes = null;

	this.vertexShader = 'void main() {\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}';
	this.fragmentShader = 'void main() {\n\tgl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}';

	this.shading = THREE.SmoothShading;

	this.linewidth = 1;

	this.wireframe = false;
	this.wireframeLinewidth = 1;

	this.fog = false; // set to use scene fog

	this.lights = false; // set to use scene lights

	this.vertexColors = THREE.NoColors; // set to use "color" attribute stream

	this.skinning = false; // set to use skinning attribute streams

	this.morphTargets = false; // set to use morph targets
	this.morphNormals = false; // set to use morph normals

	// When rendered geometry doesn't include these attributes but the material does,
	// use these default values in WebGL. This avoids errors when buffer data is missing.
	this.defaultAttributeValues = {
		'color': [ 1, 1, 1 ],
		'uv': [ 0, 0 ],
		'uv2': [ 0, 0 ]
	};

	this.index0AttributeName = undefined;

	this.setValues( parameters );

};

THREE.ShaderMaterial.prototype = Object.create( THREE.Material.prototype );

THREE.ShaderMaterial.prototype.clone = function () {

	var material = new THREE.ShaderMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.fragmentShader = this.fragmentShader;
	material.vertexShader = this.vertexShader;

	material.uniforms = THREE.UniformsUtils.clone( this.uniforms );

	material.attributes = this.attributes;
	material.defines = this.defines;

	material.shading = this.shading;

	material.wireframe = this.wireframe;
	material.wireframeLinewidth = this.wireframeLinewidth;

	material.fog = this.fog;

	material.lights = this.lights;

	material.vertexColors = this.vertexColors;

	material.skinning = this.skinning;

	material.morphTargets = this.morphTargets;
	material.morphNormals = this.morphNormals;

	return material;

};

// File:src/materials/RawShaderMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.RawShaderMaterial = function ( parameters ) {

	THREE.ShaderMaterial.call( this, parameters );

	this.type = 'RawShaderMaterial';

};

THREE.RawShaderMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );

THREE.RawShaderMaterial.prototype.clone = function () {

	var material = new THREE.RawShaderMaterial();

	THREE.ShaderMaterial.prototype.clone.call( this, material );

	return material;

};

// File:src/materials/SpriteMaterial.js

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *	uvOffset: new THREE.Vector2(),
 *	uvScale: new THREE.Vector2(),
 *
 *  fog: <bool>
 * }
 */

THREE.SpriteMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'SpriteMaterial';

	this.color = new THREE.Color( 0xffffff );
	this.map = null;

	this.rotation = 0;

	this.fog = false;

	// set parameters

	this.setValues( parameters );

};

THREE.SpriteMaterial.prototype = Object.create( THREE.Material.prototype );

THREE.SpriteMaterial.prototype.clone = function () {

	var material = new THREE.SpriteMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.color.copy( this.color );
	material.map = this.map;

	material.rotation = this.rotation;

	material.fog = this.fog;

	return material;

};

// File:src/textures/Texture.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author szimek / https://github.com/szimek/
 */

THREE.Texture = function ( image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy ) {

	Object.defineProperty( this, 'id', { value: THREE.TextureIdCount ++ } );

	this.uuid = THREE.Math.generateUUID();

	this.name = '';

	this.image = image !== undefined ? image : THREE.Texture.DEFAULT_IMAGE;
	this.mipmaps = [];

	this.mapping = mapping !== undefined ? mapping : THREE.Texture.DEFAULT_MAPPING;

	this.wrapS = wrapS !== undefined ? wrapS : THREE.ClampToEdgeWrapping;
	this.wrapT = wrapT !== undefined ? wrapT : THREE.ClampToEdgeWrapping;

	this.magFilter = magFilter !== undefined ? magFilter : THREE.LinearFilter;
	this.minFilter = minFilter !== undefined ? minFilter : THREE.LinearMipMapLinearFilter;

	this.anisotropy = anisotropy !== undefined ? anisotropy : 1;

	this.format = format !== undefined ? format : THREE.RGBAFormat;
	this.type = type !== undefined ? type : THREE.UnsignedByteType;

	this.offset = new THREE.Vector2( 0, 0 );
	this.repeat = new THREE.Vector2( 1, 1 );

	this.generateMipmaps = true;
	this.premultiplyAlpha = false;
	this.flipY = true;
	this.unpackAlignment = 4; // valid values: 1, 2, 4, 8 (see http://www.khronos.org/opengles/sdk/docs/man/xhtml/glPixelStorei.xml)

	this._needsUpdate = false;
	this.onUpdate = null;

};

THREE.Texture.DEFAULT_IMAGE = undefined;
THREE.Texture.DEFAULT_MAPPING = new THREE.UVMapping();

THREE.Texture.prototype = {

	constructor: THREE.Texture,

	get needsUpdate () {

		return this._needsUpdate;

	},

	set needsUpdate ( value ) {

		if ( value === true ) this.update();

		this._needsUpdate = value;

	},

	clone: function ( texture ) {

		if ( texture === undefined ) texture = new THREE.Texture();

		texture.image = this.image;
		texture.mipmaps = this.mipmaps.slice( 0 );

		texture.mapping = this.mapping;

		texture.wrapS = this.wrapS;
		texture.wrapT = this.wrapT;

		texture.magFilter = this.magFilter;
		texture.minFilter = this.minFilter;

		texture.anisotropy = this.anisotropy;

		texture.format = this.format;
		texture.type = this.type;

		texture.offset.copy( this.offset );
		texture.repeat.copy( this.repeat );

		texture.generateMipmaps = this.generateMipmaps;
		texture.premultiplyAlpha = this.premultiplyAlpha;
		texture.flipY = this.flipY;
		texture.unpackAlignment = this.unpackAlignment;

		return texture;

	},

	update: function () {

		this.dispatchEvent( { type: 'update' } );

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

};

THREE.EventDispatcher.prototype.apply( THREE.Texture.prototype );

THREE.TextureIdCount = 0;

// File:src/textures/CubeTexture.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.CubeTexture = function ( images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy ) {

	THREE.Texture.call( this, images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy );

	this.images = images;

};

THREE.CubeTexture.prototype = Object.create( THREE.Texture.prototype );

THREE.CubeTexture.clone = function ( texture ) {

	if ( texture === undefined ) texture = new THREE.CubeTexture();

	THREE.Texture.prototype.clone.call( this, texture );

	texture.images = this.images;

	return texture;

};

// File:src/textures/CompressedTexture.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.CompressedTexture = function ( mipmaps, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy ) {

	THREE.Texture.call( this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy );

	this.image = { width: width, height: height };
	this.mipmaps = mipmaps;

	// no flipping for cube textures
	// (also flipping doesn't work for compressed textures )

	this.flipY = false;

	// can't generate mipmaps for compressed textures
	// mips must be embedded in DDS files

	this.generateMipmaps = false;

};

THREE.CompressedTexture.prototype = Object.create( THREE.Texture.prototype );

THREE.CompressedTexture.prototype.clone = function () {

	var texture = new THREE.CompressedTexture();

	THREE.Texture.prototype.clone.call( this, texture );

	return texture;

};

// File:src/textures/DataTexture.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.DataTexture = function ( data, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy ) {

	THREE.Texture.call( this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy );

	this.image = { data: data, width: width, height: height };

};

THREE.DataTexture.prototype = Object.create( THREE.Texture.prototype );

THREE.DataTexture.prototype.clone = function () {

	var texture = new THREE.DataTexture();

	THREE.Texture.prototype.clone.call( this, texture );

	return texture;

};

// File:src/textures/VideoTexture.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.VideoTexture = function ( video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy ) {

	THREE.Texture.call( this, video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy );

	this.generateMipmaps = false;

	var scope = this;

	var update = function () {

		requestAnimationFrame( update );

		if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

			scope.needsUpdate = true;

		}

	};

	update();

};

THREE.VideoTexture.prototype = Object.create( THREE.Texture.prototype );

// File:src/objects/Group.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Group = function () {

	THREE.Object3D.call( this );

	this.type = 'Group';

};

THREE.Group.prototype = Object.create( THREE.Object3D.prototype );

// File:src/objects/PointCloud.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.PointCloud = function ( geometry, material ) {

	THREE.Object3D.call( this );

	this.type = 'PointCloud';

	this.geometry = geometry !== undefined ? geometry : new THREE.Geometry();
	this.material = material !== undefined ? material : new THREE.PointCloudMaterial( { color: Math.random() * 0xffffff } );

	this.sortParticles = false;

};

THREE.PointCloud.prototype = Object.create( THREE.Object3D.prototype );

THREE.PointCloud.prototype.raycast = ( function () {

	var inverseMatrix = new THREE.Matrix4();
	var ray = new THREE.Ray();

	return function ( raycaster, intersects ) {

		var object = this;
		var geometry = object.geometry;
		var threshold = raycaster.params.PointCloud.threshold;

		inverseMatrix.getInverse( this.matrixWorld );
		ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

		if ( geometry.boundingBox !== null ) {

			if ( ray.isIntersectionBox( geometry.boundingBox ) === false ) {

				return;

			}

		}

		var localThreshold = threshold / ( ( this.scale.x + this.scale.y + this.scale.z ) / 3 );
		var position = new THREE.Vector3();

		var testPoint = function ( point, index ) {

			var rayPointDistance = ray.distanceToPoint( point );

			if ( rayPointDistance < localThreshold ) {

				var intersectPoint = ray.closestPointToPoint( point );
				intersectPoint.applyMatrix4( object.matrixWorld );

				var distance = raycaster.ray.origin.distanceTo( intersectPoint );

				intersects.push( {

					distance: distance,
					distanceToRay: rayPointDistance,
					point: intersectPoint.clone(),
					index: index,
					face: null,
					object: object

				} );

			}

		};

		if ( geometry instanceof THREE.BufferGeometry ) {

			var attributes = geometry.attributes;
			var positions = attributes.position.array;

			if ( attributes.index !== undefined ) {

				var indices = attributes.index.array;
				var offsets = geometry.offsets;

				if ( offsets.length === 0 ) {

					var offset = {
						start: 0,
						count: indices.length,
						index: 0
					};

					offsets = [ offset ];

				}

				for ( var oi = 0, ol = offsets.length; oi < ol; ++oi ) {

					var start = offsets[ oi ].start;
					var count = offsets[ oi ].count;
					var index = offsets[ oi ].index;

					for ( var i = start, il = start + count; i < il; i ++ ) {

						var a = index + indices[ i ];

						position.fromArray( positions, a * 3 );

						testPoint( position, a );

					}

				}

			} else {

				var pointCount = positions.length / 3;

				for ( var i = 0; i < pointCount; i ++ ) {

					position.set(
						positions[ 3 * i ],
						positions[ 3 * i + 1 ],
						positions[ 3 * i + 2 ]
					);

					testPoint( position, i );

				}

			}

		} else {

			var vertices = this.geometry.vertices;

			for ( var i = 0; i < vertices.length; i ++ ) {

				testPoint( vertices[ i ], i );

			}

		}

	};

}() );

THREE.PointCloud.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.PointCloud( this.geometry, this.material );

	object.sortParticles = this.sortParticles;

	THREE.Object3D.prototype.clone.call( this, object );

	return object;

};

// Backwards compatibility

THREE.ParticleSystem = function ( geometry, material ) {

	console.warn( 'THREE.ParticleSystem has been renamed to THREE.PointCloud.' );
	return new THREE.PointCloud( geometry, material );

};

// File:src/objects/Line.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Line = function ( geometry, material, mode ) {

	THREE.Object3D.call( this );

	this.type = 'Line';

	this.geometry = geometry !== undefined ? geometry : new THREE.Geometry();
	this.material = material !== undefined ? material : new THREE.LineBasicMaterial( { color: Math.random() * 0xffffff } );

	this.mode = ( mode !== undefined ) ? mode : THREE.LineStrip;

};

THREE.LineStrip = 0;
THREE.LinePieces = 1;

THREE.Line.prototype = Object.create( THREE.Object3D.prototype );

THREE.Line.prototype.raycast = ( function () {

	var inverseMatrix = new THREE.Matrix4();
	var ray = new THREE.Ray();
	var sphere = new THREE.Sphere();

	return function ( raycaster, intersects ) {

		var precision = raycaster.linePrecision;
		var precisionSq = precision * precision;

		var geometry = this.geometry;

		if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

		// Checking boundingSphere distance to ray

		sphere.copy( geometry.boundingSphere );
		sphere.applyMatrix4( this.matrixWorld );

		if ( raycaster.ray.isIntersectionSphere( sphere ) === false ) {

			return;

		}

		inverseMatrix.getInverse( this.matrixWorld );
		ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

		/* if ( geometry instanceof THREE.BufferGeometry ) {

		} else */ if ( geometry instanceof THREE.Geometry ) {

			var vertices = geometry.vertices;
			var nbVertices = vertices.length;
			var interSegment = new THREE.Vector3();
			var interRay = new THREE.Vector3();
			var step = this.mode === THREE.LineStrip ? 1 : 2;

			for ( var i = 0; i < nbVertices - 1; i = i + step ) {

				var distSq = ray.distanceSqToSegment( vertices[ i ], vertices[ i + 1 ], interRay, interSegment );

				if ( distSq > precisionSq ) continue;

				var distance = ray.origin.distanceTo( interRay );

				if ( distance < raycaster.near || distance > raycaster.far ) continue;

				intersects.push( {

					distance: distance,
					// What do we want? intersection point on the ray or on the segment??
					// point: raycaster.ray.at( distance ),
					point: interSegment.clone().applyMatrix4( this.matrixWorld ),
					face: null,
					faceIndex: null,
					object: this

				} );

			}

		}

	};

}() );

THREE.Line.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.Line( this.geometry, this.material, this.mode );

	THREE.Object3D.prototype.clone.call( this, object );

	return object;

};

// File:src/objects/Mesh.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author jonobr1 / http://jonobr1.com/
 */

THREE.Mesh = function ( geometry, material ) {

	THREE.Object3D.call( this );

	this.type = 'Mesh';
	
	this.geometry = geometry !== undefined ? geometry : new THREE.Geometry();
	this.material = material !== undefined ? material : new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } );

	this.updateMorphTargets();

};

THREE.Mesh.prototype = Object.create( THREE.Object3D.prototype );

THREE.Mesh.prototype.updateMorphTargets = function () {

	if ( this.geometry.morphTargets !== undefined && this.geometry.morphTargets.length > 0 ) {

		this.morphTargetBase = - 1;
		this.morphTargetForcedOrder = [];
		this.morphTargetInfluences = [];
		this.morphTargetDictionary = {};

		for ( var m = 0, ml = this.geometry.morphTargets.length; m < ml; m ++ ) {

			this.morphTargetInfluences.push( 0 );
			this.morphTargetDictionary[ this.geometry.morphTargets[ m ].name ] = m;

		}

	}

};

THREE.Mesh.prototype.getMorphTargetIndexByName = function ( name ) {

	if ( this.morphTargetDictionary[ name ] !== undefined ) {

		return this.morphTargetDictionary[ name ];

	}

	console.log( 'THREE.Mesh.getMorphTargetIndexByName: morph target ' + name + ' does not exist. Returning 0.' );

	return 0;

};


THREE.Mesh.prototype.raycast = ( function () {

	var inverseMatrix = new THREE.Matrix4();
	var ray = new THREE.Ray();
	var sphere = new THREE.Sphere();

	var vA = new THREE.Vector3();
	var vB = new THREE.Vector3();
	var vC = new THREE.Vector3();

	return function ( raycaster, intersects ) {

		var geometry = this.geometry;

		// Checking boundingSphere distance to ray

		if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

		sphere.copy( geometry.boundingSphere );
		sphere.applyMatrix4( this.matrixWorld );

		if ( raycaster.ray.isIntersectionSphere( sphere ) === false ) {

			return;

		}

		// Check boundingBox before continuing

		inverseMatrix.getInverse( this.matrixWorld );
		ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

		if ( geometry.boundingBox !== null ) {

			if ( ray.isIntersectionBox( geometry.boundingBox ) === false )  {

				return;

			}

		}

		if ( geometry instanceof THREE.BufferGeometry ) {

			var material = this.material;

			if ( material === undefined ) return;

			var attributes = geometry.attributes;

			var a, b, c;
			var precision = raycaster.precision;

			if ( attributes.index !== undefined ) {

				var indices = attributes.index.array;
				var positions = attributes.position.array;
				var offsets = geometry.offsets;

				if ( offsets.length === 0 ) {

					offsets = [ { start: 0, count: indices.length, index: 0 } ];

				}

				for ( var oi = 0, ol = offsets.length; oi < ol; ++oi ) {

					var start = offsets[ oi ].start;
					var count = offsets[ oi ].count;
					var index = offsets[ oi ].index;

					for ( var i = start, il = start + count; i < il; i += 3 ) {

						a = index + indices[ i ];
						b = index + indices[ i + 1 ];
						c = index + indices[ i + 2 ];

						vA.fromArray( positions, a * 3 );
						vB.fromArray( positions, b * 3 );
						vC.fromArray( positions, c * 3 );

						if ( material.side === THREE.BackSide ) {

							var intersectionPoint = ray.intersectTriangle( vC, vB, vA, true );

						} else {

							var intersectionPoint = ray.intersectTriangle( vA, vB, vC, material.side !== THREE.DoubleSide );

						}

						if ( intersectionPoint === null ) continue;

						intersectionPoint.applyMatrix4( this.matrixWorld );

						var distance = raycaster.ray.origin.distanceTo( intersectionPoint );

						if ( distance < precision || distance < raycaster.near || distance > raycaster.far ) continue;

						intersects.push( {

							distance: distance,
							point: intersectionPoint,
							face: new THREE.Face3( a, b, c, THREE.Triangle.normal( vA, vB, vC ) ),
							faceIndex: null,
							object: this

						} );

					}

				}

			} else {

				var positions = attributes.position.array;

				for ( var i = 0, j = 0, il = positions.length; i < il; i += 3, j += 9 ) {

					a = i;
					b = i + 1;
					c = i + 2;

					vA.fromArray( positions, j );
					vB.fromArray( positions, j + 3 );
					vC.fromArray( positions, j + 6 );

					if ( material.side === THREE.BackSide ) {

						var intersectionPoint = ray.intersectTriangle( vC, vB, vA, true );

					} else {

						var intersectionPoint = ray.intersectTriangle( vA, vB, vC, material.side !== THREE.DoubleSide );

					}

					if ( intersectionPoint === null ) continue;

					intersectionPoint.applyMatrix4( this.matrixWorld );

					var distance = raycaster.ray.origin.distanceTo( intersectionPoint );

					if ( distance < precision || distance < raycaster.near || distance > raycaster.far ) continue;

					intersects.push( {

						distance: distance,
						point: intersectionPoint,
						face: new THREE.Face3( a, b, c, THREE.Triangle.normal( vA, vB, vC ) ),
						faceIndex: null,
						object: this

					} );

				}

			}

		} else if ( geometry instanceof THREE.Geometry ) {

			var isFaceMaterial = this.material instanceof THREE.MeshFaceMaterial;
			var objectMaterials = isFaceMaterial === true ? this.material.materials : null;

			var a, b, c, d;
			var precision = raycaster.precision;

			var vertices = geometry.vertices;

			for ( var f = 0, fl = geometry.faces.length; f < fl; f ++ ) {

				var face = geometry.faces[ f ];

				var material = isFaceMaterial === true ? objectMaterials[ face.materialIndex ] : this.material;

				if ( material === undefined ) continue;

				a = vertices[ face.a ];
				b = vertices[ face.b ];
				c = vertices[ face.c ];

				if ( material.morphTargets === true ) {

					var morphTargets = geometry.morphTargets;
					var morphInfluences = this.morphTargetInfluences;

					vA.set( 0, 0, 0 );
					vB.set( 0, 0, 0 );
					vC.set( 0, 0, 0 );

					for ( var t = 0, tl = morphTargets.length; t < tl; t ++ ) {

						var influence = morphInfluences[ t ];

						if ( influence === 0 ) continue;

						var targets = morphTargets[ t ].vertices;

						vA.x += ( targets[ face.a ].x - a.x ) * influence;
						vA.y += ( targets[ face.a ].y - a.y ) * influence;
						vA.z += ( targets[ face.a ].z - a.z ) * influence;

						vB.x += ( targets[ face.b ].x - b.x ) * influence;
						vB.y += ( targets[ face.b ].y - b.y ) * influence;
						vB.z += ( targets[ face.b ].z - b.z ) * influence;

						vC.x += ( targets[ face.c ].x - c.x ) * influence;
						vC.y += ( targets[ face.c ].y - c.y ) * influence;
						vC.z += ( targets[ face.c ].z - c.z ) * influence;

					}

					vA.add( a );
					vB.add( b );
					vC.add( c );

					a = vA;
					b = vB;
					c = vC;

				}

				if ( material.side === THREE.BackSide ) {

					var intersectionPoint = ray.intersectTriangle( c, b, a, true );

				} else {

					var intersectionPoint = ray.intersectTriangle( a, b, c, material.side !== THREE.DoubleSide );

				}

				if ( intersectionPoint === null ) continue;

				intersectionPoint.applyMatrix4( this.matrixWorld );

				var distance = raycaster.ray.origin.distanceTo( intersectionPoint );

				if ( distance < precision || distance < raycaster.near || distance > raycaster.far ) continue;

				intersects.push( {

					distance: distance,
					point: intersectionPoint,
					face: face,
					faceIndex: f,
					object: this

				} );

			}

		}

	};

}() );

THREE.Mesh.prototype.clone = function ( object, recursive ) {

	if ( object === undefined ) object = new THREE.Mesh( this.geometry, this.material );

	THREE.Object3D.prototype.clone.call( this, object, recursive );

	return object;

};

// File:src/objects/Bone.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author ikerr / http://verold.com
 */

THREE.Bone = function ( belongsToSkin ) {

	THREE.Object3D.call( this );

	this.skin = belongsToSkin;

};

THREE.Bone.prototype = Object.create( THREE.Object3D.prototype );


// File:src/objects/Skeleton.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author michael guerrero / http://realitymeltdown.com
 * @author ikerr / http://verold.com
 */

THREE.Skeleton = function ( bones, boneInverses, useVertexTexture ) {

	this.useVertexTexture = useVertexTexture !== undefined ? useVertexTexture : true;

	this.identityMatrix = new THREE.Matrix4();

	// copy the bone array

	bones = bones || [];

	this.bones = bones.slice( 0 );

	// create a bone texture or an array of floats

	if ( this.useVertexTexture ) {

		// layout (1 matrix = 4 pixels)
		//      RGBA RGBA RGBA RGBA (=> column1, column2, column3, column4)
		//  with  8x8  pixel texture max   16 bones  (8 * 8  / 4)
		//       16x16 pixel texture max   64 bones (16 * 16 / 4)
		//       32x32 pixel texture max  256 bones (32 * 32 / 4)
		//       64x64 pixel texture max 1024 bones (64 * 64 / 4)

		var size;

		if ( this.bones.length > 256 )
			size = 64;
		else if ( this.bones.length > 64 )
			size = 32;
		else if ( this.bones.length > 16 )
			size = 16;
		else
			size = 8;

		this.boneTextureWidth = size;
		this.boneTextureHeight = size;

		this.boneMatrices = new Float32Array( this.boneTextureWidth * this.boneTextureHeight * 4 ); // 4 floats per RGBA pixel
		this.boneTexture = new THREE.DataTexture( this.boneMatrices, this.boneTextureWidth, this.boneTextureHeight, THREE.RGBAFormat, THREE.FloatType );
		this.boneTexture.minFilter = THREE.NearestFilter;
		this.boneTexture.magFilter = THREE.NearestFilter;
		this.boneTexture.generateMipmaps = false;
		this.boneTexture.flipY = false;

	} else {

		this.boneMatrices = new Float32Array( 16 * this.bones.length );

	}

	// use the supplied bone inverses or calculate the inverses

	if ( boneInverses === undefined ) {

		this.calculateInverses();

	} else {

		if ( this.bones.length === boneInverses.length ) {

			this.boneInverses = boneInverses.slice( 0 );

		} else {

			console.warn( 'THREE.Skeleton bonInverses is the wrong length.' );

			this.boneInverses = [];

			for ( var b = 0, bl = this.bones.length; b < bl; b ++ ) {

				this.boneInverses.push( new THREE.Matrix4() );

			}

		}

	}

};

THREE.Skeleton.prototype.calculateInverses = function () {

	this.boneInverses = [];

	for ( var b = 0, bl = this.bones.length; b < bl; b ++ ) {

		var inverse = new THREE.Matrix4();

		if ( this.bones[ b ] ) {

			inverse.getInverse( this.bones[ b ].matrixWorld );

		}

		this.boneInverses.push( inverse );

	}

};

THREE.Skeleton.prototype.pose = function () {

	var bone;

	// recover the bind-time world matrices

	for ( var b = 0, bl = this.bones.length; b < bl; b ++ ) {

		bone = this.bones[ b ];

		if ( bone ) {

			bone.matrixWorld.getInverse( this.boneInverses[ b ] );

		}

	}

	// compute the local matrices, positions, rotations and scales

	for ( var b = 0, bl = this.bones.length; b < bl; b ++ ) {

		bone = this.bones[ b ];

		if ( bone ) {

			if ( bone.parent ) {

				bone.matrix.getInverse( bone.parent.matrixWorld );
				bone.matrix.multiply( bone.matrixWorld );

			} else {

				bone.matrix.copy( bone.matrixWorld );

			}

			bone.matrix.decompose( bone.position, bone.quaternion, bone.scale );

		}

	}

};

THREE.Skeleton.prototype.update = ( function () {

	var offsetMatrix = new THREE.Matrix4();
	
	return function () {

		// flatten bone matrices to array

		for ( var b = 0, bl = this.bones.length; b < bl; b ++ ) {

			// compute the offset between the current and the original transform

			var matrix = this.bones[ b ] ? this.bones[ b ].matrixWorld : this.identityMatrix;

			offsetMatrix.multiplyMatrices( matrix, this.boneInverses[ b ] );
			offsetMatrix.flattenToArrayOffset( this.boneMatrices, b * 16 );

		}

		if ( this.useVertexTexture ) {

			this.boneTexture.needsUpdate = true;

		}
		
	};

} )();


// File:src/objects/SkinnedMesh.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author ikerr / http://verold.com
 */

THREE.SkinnedMesh = function ( geometry, material, useVertexTexture ) {

	THREE.Mesh.call( this, geometry, material );

	this.type = 'SkinnedMesh';

	this.bindMode = "attached";
	this.bindMatrix = new THREE.Matrix4();
	this.bindMatrixInverse = new THREE.Matrix4();

	// init bones

	// TODO: remove bone creation as there is no reason (other than
	// convenience) for THREE.SkinnedMesh to do this.

	var bones = [];

	if ( this.geometry && this.geometry.bones !== undefined ) {

		var bone, gbone, p, q, s;

		for ( var b = 0, bl = this.geometry.bones.length; b < bl; ++b ) {

			gbone = this.geometry.bones[ b ];

			p = gbone.pos;
			q = gbone.rotq;
			s = gbone.scl;

			bone = new THREE.Bone( this );
			bones.push( bone );

			bone.name = gbone.name;
			bone.position.set( p[ 0 ], p[ 1 ], p[ 2 ] );
			bone.quaternion.set( q[ 0 ], q[ 1 ], q[ 2 ], q[ 3 ] );

			if ( s !== undefined ) {

				bone.scale.set( s[ 0 ], s[ 1 ], s[ 2 ] );

			} else {

				bone.scale.set( 1, 1, 1 );

			}

		}

		for ( var b = 0, bl = this.geometry.bones.length; b < bl; ++b ) {

			gbone = this.geometry.bones[ b ];

			if ( gbone.parent !== - 1 ) {

				bones[ gbone.parent ].add( bones[ b ] );

			} else {

				this.add( bones[ b ] );

			}

		}

	}

	this.normalizeSkinWeights();

	this.updateMatrixWorld( true );
	this.bind( new THREE.Skeleton( bones, undefined, useVertexTexture ) );

};


THREE.SkinnedMesh.prototype = Object.create( THREE.Mesh.prototype );

THREE.SkinnedMesh.prototype.bind = function( skeleton, bindMatrix ) {

	this.skeleton = skeleton;

	if ( bindMatrix === undefined ) {

		this.updateMatrixWorld( true );

		bindMatrix = this.matrixWorld;

	}

	this.bindMatrix.copy( bindMatrix );
	this.bindMatrixInverse.getInverse( bindMatrix );

};

THREE.SkinnedMesh.prototype.pose = function () {

	this.skeleton.pose();

};

THREE.SkinnedMesh.prototype.normalizeSkinWeights = function () {

	if ( this.geometry instanceof THREE.Geometry ) {

		for ( var i = 0; i < this.geometry.skinIndices.length; i ++ ) {

			var sw = this.geometry.skinWeights[ i ];

			var scale = 1.0 / sw.lengthManhattan();

			if ( scale !== Infinity ) {

				sw.multiplyScalar( scale );

			} else {

				sw.set( 1 ); // this will be normalized by the shader anyway

			}

		}

	} else {

		// skinning weights assumed to be normalized for THREE.BufferGeometry

	}

};

THREE.SkinnedMesh.prototype.updateMatrixWorld = function( force ) {

	THREE.Mesh.prototype.updateMatrixWorld.call( this, true );

	if ( this.bindMode === "attached" ) {

		this.bindMatrixInverse.getInverse( this.matrixWorld );

	} else if ( this.bindMode === "detached" ) {

		this.bindMatrixInverse.getInverse( this.bindMatrix );

	} else {

		console.warn( 'THREE.SkinnedMesh unreckognized bindMode: ' + this.bindMode );

	}

};

THREE.SkinnedMesh.prototype.clone = function( object ) {

	if ( object === undefined ) {

		object = new THREE.SkinnedMesh( this.geometry, this.material, this.useVertexTexture );

	}

	THREE.Mesh.prototype.clone.call( this, object );

	return object;

};


// File:src/objects/MorphAnimMesh.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.MorphAnimMesh = function ( geometry, material ) {

	THREE.Mesh.call( this, geometry, material );

	this.type = 'MorphAnimMesh';

	// API

	this.duration = 1000; // milliseconds
	this.mirroredLoop = false;
	this.time = 0;

	// internals

	this.lastKeyframe = 0;
	this.currentKeyframe = 0;

	this.direction = 1;
	this.directionBackwards = false;

	this.setFrameRange( 0, this.geometry.morphTargets.length - 1 );

};

THREE.MorphAnimMesh.prototype = Object.create( THREE.Mesh.prototype );

THREE.MorphAnimMesh.prototype.setFrameRange = function ( start, end ) {

	this.startKeyframe = start;
	this.endKeyframe = end;

	this.length = this.endKeyframe - this.startKeyframe + 1;

};

THREE.MorphAnimMesh.prototype.setDirectionForward = function () {

	this.direction = 1;
	this.directionBackwards = false;

};

THREE.MorphAnimMesh.prototype.setDirectionBackward = function () {

	this.direction = - 1;
	this.directionBackwards = true;

};

THREE.MorphAnimMesh.prototype.parseAnimations = function () {

	var geometry = this.geometry;

	if ( ! geometry.animations ) geometry.animations = {};

	var firstAnimation, animations = geometry.animations;

	var pattern = /([a-z]+)_?(\d+)/;

	for ( var i = 0, il = geometry.morphTargets.length; i < il; i ++ ) {

		var morph = geometry.morphTargets[ i ];
		var parts = morph.name.match( pattern );

		if ( parts && parts.length > 1 ) {

			var label = parts[ 1 ];
			var num = parts[ 2 ];

			if ( ! animations[ label ] ) animations[ label ] = { start: Infinity, end: - Infinity };

			var animation = animations[ label ];

			if ( i < animation.start ) animation.start = i;
			if ( i > animation.end ) animation.end = i;

			if ( ! firstAnimation ) firstAnimation = label;

		}

	}

	geometry.firstAnimation = firstAnimation;

};

THREE.MorphAnimMesh.prototype.setAnimationLabel = function ( label, start, end ) {

	if ( ! this.geometry.animations ) this.geometry.animations = {};

	this.geometry.animations[ label ] = { start: start, end: end };

};

THREE.MorphAnimMesh.prototype.playAnimation = function ( label, fps ) {

	var animation = this.geometry.animations[ label ];

	if ( animation ) {

		this.setFrameRange( animation.start, animation.end );
		this.duration = 1000 * ( ( animation.end - animation.start ) / fps );
		this.time = 0;

	} else {

		console.warn( 'animation[' + label + '] undefined' );

	}

};

THREE.MorphAnimMesh.prototype.updateAnimation = function ( delta ) {

	var frameTime = this.duration / this.length;

	this.time += this.direction * delta;

	if ( this.mirroredLoop ) {

		if ( this.time > this.duration || this.time < 0 ) {

			this.direction *= - 1;

			if ( this.time > this.duration ) {

				this.time = this.duration;
				this.directionBackwards = true;

			}

			if ( this.time < 0 ) {

				this.time = 0;
				this.directionBackwards = false;

			}

		}

	} else {

		this.time = this.time % this.duration;

		if ( this.time < 0 ) this.time += this.duration;

	}

	var keyframe = this.startKeyframe + THREE.Math.clamp( Math.floor( this.time / frameTime ), 0, this.length - 1 );

	if ( keyframe !== this.currentKeyframe ) {

		this.morphTargetInfluences[ this.lastKeyframe ] = 0;
		this.morphTargetInfluences[ this.currentKeyframe ] = 1;

		this.morphTargetInfluences[ keyframe ] = 0;

		this.lastKeyframe = this.currentKeyframe;
		this.currentKeyframe = keyframe;

	}

	var mix = ( this.time % frameTime ) / frameTime;

	if ( this.directionBackwards ) {

		mix = 1 - mix;

	}

	this.morphTargetInfluences[ this.currentKeyframe ] = mix;
	this.morphTargetInfluences[ this.lastKeyframe ] = 1 - mix;

};

THREE.MorphAnimMesh.prototype.interpolateTargets = function ( a, b, t ) {

	var influences = this.morphTargetInfluences;

	for ( var i = 0, l = influences.length; i < l; i ++ ) {

		influences[ i ] = 0;

	}

	if ( a > -1 ) influences[ a ] = 1 - t;
	if ( b > -1 ) influences[ b ] = t;

};

THREE.MorphAnimMesh.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.MorphAnimMesh( this.geometry, this.material );

	object.duration = this.duration;
	object.mirroredLoop = this.mirroredLoop;
	object.time = this.time;

	object.lastKeyframe = this.lastKeyframe;
	object.currentKeyframe = this.currentKeyframe;

	object.direction = this.direction;
	object.directionBackwards = this.directionBackwards;

	THREE.Mesh.prototype.clone.call( this, object );

	return object;

};

// File:src/objects/LOD.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.LOD = function () {

	THREE.Object3D.call( this );

	this.objects = [];

};


THREE.LOD.prototype = Object.create( THREE.Object3D.prototype );

THREE.LOD.prototype.addLevel = function ( object, distance ) {

	if ( distance === undefined ) distance = 0;

	distance = Math.abs( distance );

	for ( var l = 0; l < this.objects.length; l ++ ) {

		if ( distance < this.objects[ l ].distance ) {

			break;

		}

	}

	this.objects.splice( l, 0, { distance: distance, object: object } );
	this.add( object );

};

THREE.LOD.prototype.getObjectForDistance = function ( distance ) {

	for ( var i = 1, l = this.objects.length; i < l; i ++ ) {

		if ( distance < this.objects[ i ].distance ) {

			break;

		}

	}

	return this.objects[ i - 1 ].object;

};

THREE.LOD.prototype.raycast = ( function () {

	var matrixPosition = new THREE.Vector3();

	return function ( raycaster, intersects ) {

		matrixPosition.setFromMatrixPosition( this.matrixWorld );

		var distance = raycaster.ray.origin.distanceTo( matrixPosition );

		this.getObjectForDistance( distance ).raycast( raycaster, intersects );

	};

}() );

THREE.LOD.prototype.update = function () {

	var v1 = new THREE.Vector3();
	var v2 = new THREE.Vector3();

	return function ( camera ) {

		if ( this.objects.length > 1 ) {

			v1.setFromMatrixPosition( camera.matrixWorld );
			v2.setFromMatrixPosition( this.matrixWorld );

			var distance = v1.distanceTo( v2 );

			this.objects[ 0 ].object.visible = true;

			for ( var i = 1, l = this.objects.length; i < l; i ++ ) {

				if ( distance >= this.objects[ i ].distance ) {

					this.objects[ i - 1 ].object.visible = false;
					this.objects[ i     ].object.visible = true;

				} else {

					break;

				}

			}

			for ( ; i < l; i ++ ) {

				this.objects[ i ].object.visible = false;

			}

		}

	};

}();

THREE.LOD.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.LOD();

	THREE.Object3D.prototype.clone.call( this, object );

	for ( var i = 0, l = this.objects.length; i < l; i ++ ) {
		var x = this.objects[ i ].object.clone();
		x.visible = i === 0;
		object.addLevel( x, this.objects[ i ].distance );
	}

	return object;

};

// File:src/objects/Sprite.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Sprite = ( function () {

	var indices = new Uint16Array( [ 0, 1, 2,  0, 2, 3 ] );
	var vertices = new Float32Array( [ - 0.5, - 0.5, 0,   0.5, - 0.5, 0,   0.5, 0.5, 0,   - 0.5, 0.5, 0 ] );
	var uvs = new Float32Array( [ 0, 0,   1, 0,   1, 1,   0, 1 ] );

	var geometry = new THREE.BufferGeometry();
	geometry.addAttribute( 'index', new THREE.BufferAttribute( indices, 1 ) );
	geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

	return function ( material ) {

		THREE.Object3D.call( this );

		this.type = 'Sprite';

		this.geometry = geometry;
		this.material = ( material !== undefined ) ? material : new THREE.SpriteMaterial();

	};

} )();

THREE.Sprite.prototype = Object.create( THREE.Object3D.prototype );

THREE.Sprite.prototype.raycast = ( function () {

	var matrixPosition = new THREE.Vector3();

	return function ( raycaster, intersects ) {

		matrixPosition.setFromMatrixPosition( this.matrixWorld );

		var distance = raycaster.ray.distanceToPoint( matrixPosition );

		if ( distance > this.scale.x ) {

			return;

		}

		intersects.push( {

			distance: distance,
			point: this.position,
			face: null,
			object: this

		} );

	};

}() );

THREE.Sprite.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.Sprite( this.material );

	THREE.Object3D.prototype.clone.call( this, object );

	return object;

};

// Backwards compatibility

THREE.Particle = THREE.Sprite;

// File:src/objects/LensFlare.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.LensFlare = function ( texture, size, distance, blending, color ) {

	THREE.Object3D.call( this );

	this.lensFlares = [];

	this.positionScreen = new THREE.Vector3();
	this.customUpdateCallback = undefined;

	if( texture !== undefined ) {

		this.add( texture, size, distance, blending, color );

	}

};

THREE.LensFlare.prototype = Object.create( THREE.Object3D.prototype );


/*
 * Add: adds another flare
 */

THREE.LensFlare.prototype.add = function ( texture, size, distance, blending, color, opacity ) {

	if ( size === undefined ) size = - 1;
	if ( distance === undefined ) distance = 0;
	if ( opacity === undefined ) opacity = 1;
	if ( color === undefined ) color = new THREE.Color( 0xffffff );
	if ( blending === undefined ) blending = THREE.NormalBlending;

	distance = Math.min( distance, Math.max( 0, distance ) );

	this.lensFlares.push( {
		texture: texture, 			// THREE.Texture
		size: size, 				// size in pixels (-1 = use texture.width)
		distance: distance, 		// distance (0-1) from light source (0=at light source)
		x: 0, y: 0, z: 0,			// screen position (-1 => 1) z = 0 is ontop z = 1 is back
		scale: 1, 					// scale
		rotation: 1, 				// rotation
		opacity: opacity,			// opacity
		color: color,				// color
		blending: blending			// blending
	} );

};

/*
 * Update lens flares update positions on all flares based on the screen position
 * Set myLensFlare.customUpdateCallback to alter the flares in your project specific way.
 */

THREE.LensFlare.prototype.updateLensFlares = function () {

	var f, fl = this.lensFlares.length;
	var flare;
	var vecX = - this.positionScreen.x * 2;
	var vecY = - this.positionScreen.y * 2;

	for( f = 0; f < fl; f ++ ) {

		flare = this.lensFlares[ f ];

		flare.x = this.positionScreen.x + vecX * flare.distance;
		flare.y = this.positionScreen.y + vecY * flare.distance;

		flare.wantedRotation = flare.x * Math.PI * 0.25;
		flare.rotation += ( flare.wantedRotation - flare.rotation ) * 0.25;

	}

};


// File:src/scenes/Scene.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Scene = function () {

	THREE.Object3D.call( this );

	this.type = 'Scene';

	this.fog = null;
	this.overrideMaterial = null;

	this.autoUpdate = true; // checked by the renderer

};

THREE.Scene.prototype = Object.create( THREE.Object3D.prototype );

THREE.Scene.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.Scene();

	THREE.Object3D.prototype.clone.call( this, object );

	if ( this.fog !== null ) object.fog = this.fog.clone();
	if ( this.overrideMaterial !== null ) object.overrideMaterial = this.overrideMaterial.clone();

	object.autoUpdate = this.autoUpdate;
	object.matrixAutoUpdate = this.matrixAutoUpdate;

	return object;

};

// File:src/scenes/Fog.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Fog = function ( color, near, far ) {

	this.name = '';

	this.color = new THREE.Color( color );

	this.near = ( near !== undefined ) ? near : 1;
	this.far = ( far !== undefined ) ? far : 1000;

};

THREE.Fog.prototype.clone = function () {

	return new THREE.Fog( this.color.getHex(), this.near, this.far );

};

// File:src/scenes/FogExp2.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.FogExp2 = function ( color, density ) {

	this.name = '';

	this.color = new THREE.Color( color );
	this.density = ( density !== undefined ) ? density : 0.00025;

};

THREE.FogExp2.prototype.clone = function () {

	return new THREE.FogExp2( this.color.getHex(), this.density );

};

// File:src/renderers/shaders/ShaderChunk.js

THREE.ShaderChunk = {};

// File:src/renderers/shaders/ShaderChunk/alphatest_fragment.glsl

THREE.ShaderChunk[ 'alphatest_fragment'] = "#ifdef ALPHATEST\n\n	if ( gl_FragColor.a < ALPHATEST ) discard;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/lights_lambert_vertex.glsl

THREE.ShaderChunk[ 'lights_lambert_vertex'] = "vLightFront = vec3( 0.0 );\n\n#ifdef DOUBLE_SIDED\n\n	vLightBack = vec3( 0.0 );\n\n#endif\n\ntransformedNormal = normalize( transformedNormal );\n\n#if MAX_DIR_LIGHTS > 0\n\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\n\n	vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\n	vec3 dirVector = normalize( lDirection.xyz );\n\n	float dotProduct = dot( transformedNormal, dirVector );\n	vec3 directionalLightWeighting = vec3( max( dotProduct, 0.0 ) );\n\n	#ifdef DOUBLE_SIDED\n\n		vec3 directionalLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n\n		#ifdef WRAP_AROUND\n\n			vec3 directionalLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n\n		#endif\n\n	#endif\n\n	#ifdef WRAP_AROUND\n\n		vec3 directionalLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\n		directionalLightWeighting = mix( directionalLightWeighting, directionalLightWeightingHalf, wrapRGB );\n\n		#ifdef DOUBLE_SIDED\n\n			directionalLightWeightingBack = mix( directionalLightWeightingBack, directionalLightWeightingHalfBack, wrapRGB );\n\n		#endif\n\n	#endif\n\n	vLightFront += directionalLightColor[ i ] * directionalLightWeighting;\n\n	#ifdef DOUBLE_SIDED\n\n		vLightBack += directionalLightColor[ i ] * directionalLightWeightingBack;\n\n	#endif\n\n}\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	for( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz - mvPosition.xyz;\n\n		float lDistance = 1.0;\n		if ( pointLightDistance[ i ] > 0.0 )\n			lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\n\n		lVector = normalize( lVector );\n		float dotProduct = dot( transformedNormal, lVector );\n\n		vec3 pointLightWeighting = vec3( max( dotProduct, 0.0 ) );\n\n		#ifdef DOUBLE_SIDED\n\n			vec3 pointLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n\n			#ifdef WRAP_AROUND\n\n				vec3 pointLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n\n			#endif\n\n		#endif\n\n		#ifdef WRAP_AROUND\n\n			vec3 pointLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\n			pointLightWeighting = mix( pointLightWeighting, pointLightWeightingHalf, wrapRGB );\n\n			#ifdef DOUBLE_SIDED\n\n				pointLightWeightingBack = mix( pointLightWeightingBack, pointLightWeightingHalfBack, wrapRGB );\n\n			#endif\n\n		#endif\n\n		vLightFront += pointLightColor[ i ] * pointLightWeighting * lDistance;\n\n		#ifdef DOUBLE_SIDED\n\n			vLightBack += pointLightColor[ i ] * pointLightWeightingBack * lDistance;\n\n		#endif\n\n	}\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	for( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz - mvPosition.xyz;\n\n		float spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - worldPosition.xyz ) );\n\n		if ( spotEffect > spotLightAngleCos[ i ] ) {\n\n			spotEffect = max( pow( max( spotEffect, 0.0 ), spotLightExponent[ i ] ), 0.0 );\n\n			float lDistance = 1.0;\n			if ( spotLightDistance[ i ] > 0.0 )\n				lDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\n\n			lVector = normalize( lVector );\n\n			float dotProduct = dot( transformedNormal, lVector );\n			vec3 spotLightWeighting = vec3( max( dotProduct, 0.0 ) );\n\n			#ifdef DOUBLE_SIDED\n\n				vec3 spotLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n\n				#ifdef WRAP_AROUND\n\n					vec3 spotLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n\n				#endif\n\n			#endif\n\n			#ifdef WRAP_AROUND\n\n				vec3 spotLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\n				spotLightWeighting = mix( spotLightWeighting, spotLightWeightingHalf, wrapRGB );\n\n				#ifdef DOUBLE_SIDED\n\n					spotLightWeightingBack = mix( spotLightWeightingBack, spotLightWeightingHalfBack, wrapRGB );\n\n				#endif\n\n			#endif\n\n			vLightFront += spotLightColor[ i ] * spotLightWeighting * lDistance * spotEffect;\n\n			#ifdef DOUBLE_SIDED\n\n				vLightBack += spotLightColor[ i ] * spotLightWeightingBack * lDistance * spotEffect;\n\n			#endif\n\n		}\n\n	}\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	for( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\n\n		vec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );\n		vec3 lVector = normalize( lDirection.xyz );\n\n		float dotProduct = dot( transformedNormal, lVector );\n\n		float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n		float hemiDiffuseWeightBack = -0.5 * dotProduct + 0.5;\n\n		vLightFront += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\n\n		#ifdef DOUBLE_SIDED\n\n			vLightBack += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeightBack );\n\n		#endif\n\n	}\n\n#endif\n\nvLightFront = vLightFront * diffuse + ambient * ambientLightColor + emissive;\n\n#ifdef DOUBLE_SIDED\n\n	vLightBack = vLightBack * diffuse + ambient * ambientLightColor + emissive;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/map_particle_pars_fragment.glsl

THREE.ShaderChunk[ 'map_particle_pars_fragment'] = "#ifdef USE_MAP\n\n	uniform sampler2D map;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/default_vertex.glsl

THREE.ShaderChunk[ 'default_vertex'] = "vec4 mvPosition;\n\n#ifdef USE_SKINNING\n\n	mvPosition = modelViewMatrix * skinned;\n\n#endif\n\n#if !defined( USE_SKINNING ) && defined( USE_MORPHTARGETS )\n\n	mvPosition = modelViewMatrix * vec4( morphed, 1.0 );\n\n#endif\n\n#if !defined( USE_SKINNING ) && ! defined( USE_MORPHTARGETS )\n\n	mvPosition = modelViewMatrix * vec4( position, 1.0 );\n\n#endif\n\ngl_Position = projectionMatrix * mvPosition;";

// File:src/renderers/shaders/ShaderChunk/map_pars_fragment.glsl

THREE.ShaderChunk[ 'map_pars_fragment'] = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP )\n\n	varying vec2 vUv;\n\n#endif\n\n#ifdef USE_MAP\n\n	uniform sampler2D map;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/skinnormal_vertex.glsl

THREE.ShaderChunk[ 'skinnormal_vertex'] = "#ifdef USE_SKINNING\n\n	mat4 skinMatrix = mat4( 0.0 );\n	skinMatrix += skinWeight.x * boneMatX;\n	skinMatrix += skinWeight.y * boneMatY;\n	skinMatrix += skinWeight.z * boneMatZ;\n	skinMatrix += skinWeight.w * boneMatW;\n	skinMatrix  = bindMatrixInverse * skinMatrix * bindMatrix;\n\n	#ifdef USE_MORPHNORMALS\n\n	vec4 skinnedNormal = skinMatrix * vec4( morphedNormal, 0.0 );\n\n	#else\n\n	vec4 skinnedNormal = skinMatrix * vec4( normal, 0.0 );\n\n	#endif\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/logdepthbuf_pars_vertex.glsl

THREE.ShaderChunk[ 'logdepthbuf_pars_vertex'] = "#ifdef USE_LOGDEPTHBUF\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		varying float vFragDepth;\n\n	#endif\n\n	uniform float logDepthBufFC;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/lightmap_pars_vertex.glsl

THREE.ShaderChunk[ 'lightmap_pars_vertex'] = "#ifdef USE_LIGHTMAP\n\n	varying vec2 vUv2;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/lights_phong_fragment.glsl

THREE.ShaderChunk[ 'lights_phong_fragment'] = "vec3 normal = normalize( vNormal );\nvec3 viewPosition = normalize( vViewPosition );\n\n#ifdef DOUBLE_SIDED\n\n	normal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n\n#endif\n\n#ifdef USE_NORMALMAP\n\n	normal = perturbNormal2Arb( -vViewPosition, normal );\n\n#elif defined( USE_BUMPMAP )\n\n	normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	vec3 pointDiffuse = vec3( 0.0 );\n	vec3 pointSpecular = vec3( 0.0 );\n\n	for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz + vViewPosition.xyz;\n\n		float lDistance = 1.0;\n		if ( pointLightDistance[ i ] > 0.0 )\n			lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\n\n		lVector = normalize( lVector );\n\n				// diffuse\n\n		float dotProduct = dot( normal, lVector );\n\n		#ifdef WRAP_AROUND\n\n			float pointDiffuseWeightFull = max( dotProduct, 0.0 );\n			float pointDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\n\n			vec3 pointDiffuseWeight = mix( vec3( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n\n		#else\n\n			float pointDiffuseWeight = max( dotProduct, 0.0 );\n\n		#endif\n\n		pointDiffuse += diffuse * pointLightColor[ i ] * pointDiffuseWeight * lDistance;\n\n				// specular\n\n		vec3 pointHalfVector = normalize( lVector + viewPosition );\n		float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );\n		float pointSpecularWeight = specularStrength * max( pow( pointDotNormalHalf, shininess ), 0.0 );\n\n		float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n		vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, pointHalfVector ), 0.0 ), 5.0 );\n		pointSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance * specularNormalization;\n\n	}\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	vec3 spotDiffuse = vec3( 0.0 );\n	vec3 spotSpecular = vec3( 0.0 );\n\n	for ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz + vViewPosition.xyz;\n\n		float lDistance = 1.0;\n		if ( spotLightDistance[ i ] > 0.0 )\n			lDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\n\n		lVector = normalize( lVector );\n\n		float spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );\n\n		if ( spotEffect > spotLightAngleCos[ i ] ) {\n\n			spotEffect = max( pow( max( spotEffect, 0.0 ), spotLightExponent[ i ] ), 0.0 );\n\n					// diffuse\n\n			float dotProduct = dot( normal, lVector );\n\n			#ifdef WRAP_AROUND\n\n				float spotDiffuseWeightFull = max( dotProduct, 0.0 );\n				float spotDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\n\n				vec3 spotDiffuseWeight = mix( vec3( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );\n\n			#else\n\n				float spotDiffuseWeight = max( dotProduct, 0.0 );\n\n			#endif\n\n			spotDiffuse += diffuse * spotLightColor[ i ] * spotDiffuseWeight * lDistance * spotEffect;\n\n					// specular\n\n			vec3 spotHalfVector = normalize( lVector + viewPosition );\n			float spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );\n			float spotSpecularWeight = specularStrength * max( pow( spotDotNormalHalf, shininess ), 0.0 );\n\n			float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n			vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, spotHalfVector ), 0.0 ), 5.0 );\n			spotSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * specularNormalization * spotEffect;\n\n		}\n\n	}\n\n#endif\n\n#if MAX_DIR_LIGHTS > 0\n\n	vec3 dirDiffuse = vec3( 0.0 );\n	vec3 dirSpecular = vec3( 0.0 );\n\n	for( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\n\n		vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\n		vec3 dirVector = normalize( lDirection.xyz );\n\n				// diffuse\n\n		float dotProduct = dot( normal, dirVector );\n\n		#ifdef WRAP_AROUND\n\n			float dirDiffuseWeightFull = max( dotProduct, 0.0 );\n			float dirDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\n\n			vec3 dirDiffuseWeight = mix( vec3( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), wrapRGB );\n\n		#else\n\n			float dirDiffuseWeight = max( dotProduct, 0.0 );\n\n		#endif\n\n		dirDiffuse += diffuse * directionalLightColor[ i ] * dirDiffuseWeight;\n\n		// specular\n\n		vec3 dirHalfVector = normalize( dirVector + viewPosition );\n		float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );\n		float dirSpecularWeight = specularStrength * max( pow( dirDotNormalHalf, shininess ), 0.0 );\n\n		/*\n		// fresnel term from skin shader\n		const float F0 = 0.128;\n\n		float base = 1.0 - dot( viewPosition, dirHalfVector );\n		float exponential = pow( base, 5.0 );\n\n		float fresnel = exponential + F0 * ( 1.0 - exponential );\n		*/\n\n		/*\n		// fresnel term from fresnel shader\n		const float mFresnelBias = 0.08;\n		const float mFresnelScale = 0.3;\n		const float mFresnelPower = 5.0;\n\n		float fresnel = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( -viewPosition ), normal ), mFresnelPower );\n		*/\n\n		float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n		// 		dirSpecular += specular * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization * fresnel;\n\n		vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( dirVector, dirHalfVector ), 0.0 ), 5.0 );\n		dirSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n\n\n	}\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	vec3 hemiDiffuse = vec3( 0.0 );\n	vec3 hemiSpecular = vec3( 0.0 );\n\n	for( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\n\n		vec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );\n		vec3 lVector = normalize( lDirection.xyz );\n\n		// diffuse\n\n		float dotProduct = dot( normal, lVector );\n		float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n\n		vec3 hemiColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\n\n		hemiDiffuse += diffuse * hemiColor;\n\n		// specular (sky light)\n\n		vec3 hemiHalfVectorSky = normalize( lVector + viewPosition );\n		float hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;\n		float hemiSpecularWeightSky = specularStrength * max( pow( max( hemiDotNormalHalfSky, 0.0 ), shininess ), 0.0 );\n\n		// specular (ground light)\n\n		vec3 lVectorGround = -lVector;\n\n		vec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );\n		float hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;\n		float hemiSpecularWeightGround = specularStrength * max( pow( max( hemiDotNormalHalfGround, 0.0 ), shininess ), 0.0 );\n\n		float dotProductGround = dot( normal, lVectorGround );\n\n		float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n		vec3 schlickSky = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, hemiHalfVectorSky ), 0.0 ), 5.0 );\n		vec3 schlickGround = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVectorGround, hemiHalfVectorGround ), 0.0 ), 5.0 );\n		hemiSpecular += hemiColor * specularNormalization * ( schlickSky * hemiSpecularWeightSky * max( dotProduct, 0.0 ) + schlickGround * hemiSpecularWeightGround * max( dotProductGround, 0.0 ) );\n\n	}\n\n#endif\n\nvec3 totalDiffuse = vec3( 0.0 );\nvec3 totalSpecular = vec3( 0.0 );\n\n#if MAX_DIR_LIGHTS > 0\n\n	totalDiffuse += dirDiffuse;\n	totalSpecular += dirSpecular;\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	totalDiffuse += hemiDiffuse;\n	totalSpecular += hemiSpecular;\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	totalDiffuse += pointDiffuse;\n	totalSpecular += pointSpecular;\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	totalDiffuse += spotDiffuse;\n	totalSpecular += spotSpecular;\n\n#endif\n\n#ifdef METAL\n\n	gl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient + totalSpecular );\n\n#else\n\n	gl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient ) + totalSpecular;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/fog_pars_fragment.glsl

THREE.ShaderChunk[ 'fog_pars_fragment'] = "#ifdef USE_FOG\n\n	uniform vec3 fogColor;\n\n	#ifdef FOG_EXP2\n\n		uniform float fogDensity;\n\n	#else\n\n		uniform float fogNear;\n		uniform float fogFar;\n	#endif\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/morphnormal_vertex.glsl

THREE.ShaderChunk[ 'morphnormal_vertex'] = "#ifdef USE_MORPHNORMALS\n\n	vec3 morphedNormal = vec3( 0.0 );\n\n	morphedNormal += ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];\n	morphedNormal += ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];\n	morphedNormal += ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];\n	morphedNormal += ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];\n\n	morphedNormal += normal;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/envmap_pars_fragment.glsl

THREE.ShaderChunk[ 'envmap_pars_fragment'] = "#ifdef USE_ENVMAP\n\n	uniform float reflectivity;\n	uniform samplerCube envMap;\n	uniform float flipEnvMap;\n	uniform int combine;\n\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n\n		uniform bool useRefract;\n		uniform float refractionRatio;\n\n	#else\n\n		varying vec3 vReflect;\n\n	#endif\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/logdepthbuf_fragment.glsl

THREE.ShaderChunk[ 'logdepthbuf_fragment'] = "#if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)\n\n	gl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/normalmap_pars_fragment.glsl

THREE.ShaderChunk[ 'normalmap_pars_fragment'] = "#ifdef USE_NORMALMAP\n\n	uniform sampler2D normalMap;\n	uniform vec2 normalScale;\n\n			// Per-Pixel Tangent Space Normal Mapping\n			// http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html\n\n	vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {\n\n		vec3 q0 = dFdx( eye_pos.xyz );\n		vec3 q1 = dFdy( eye_pos.xyz );\n		vec2 st0 = dFdx( vUv.st );\n		vec2 st1 = dFdy( vUv.st );\n\n		vec3 S = normalize( q0 * st1.t - q1 * st0.t );\n		vec3 T = normalize( -q0 * st1.s + q1 * st0.s );\n		vec3 N = normalize( surf_norm );\n\n		vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;\n		mapN.xy = normalScale * mapN.xy;\n		mat3 tsn = mat3( S, T, N );\n		return normalize( tsn * mapN );\n\n	}\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/lights_phong_pars_vertex.glsl

THREE.ShaderChunk[ 'lights_phong_pars_vertex'] = "#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\n	varying vec3 vWorldPosition;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/lightmap_pars_fragment.glsl

THREE.ShaderChunk[ 'lightmap_pars_fragment'] = "#ifdef USE_LIGHTMAP\n\n	varying vec2 vUv2;\n	uniform sampler2D lightMap;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/shadowmap_vertex.glsl

THREE.ShaderChunk[ 'shadowmap_vertex'] = "#ifdef USE_SHADOWMAP\n\n	for( int i = 0; i < MAX_SHADOWS; i ++ ) {\n\n		vShadowCoord[ i ] = shadowMatrix[ i ] * worldPosition;\n\n	}\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/lights_phong_vertex.glsl

THREE.ShaderChunk[ 'lights_phong_vertex'] = "#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\n	vWorldPosition = worldPosition.xyz;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/map_fragment.glsl

THREE.ShaderChunk[ 'map_fragment'] = "#ifdef USE_MAP\n\n	vec4 texelColor = texture2D( map, vUv );\n\n	#ifdef GAMMA_INPUT\n\n		texelColor.xyz *= texelColor.xyz;\n\n	#endif\n\n	gl_FragColor = gl_FragColor * texelColor;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/lightmap_vertex.glsl

THREE.ShaderChunk[ 'lightmap_vertex'] = "#ifdef USE_LIGHTMAP\n\n	vUv2 = uv2;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/map_particle_fragment.glsl

THREE.ShaderChunk[ 'map_particle_fragment'] = "#ifdef USE_MAP\n\n	gl_FragColor = gl_FragColor * texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) );\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/color_pars_fragment.glsl

THREE.ShaderChunk[ 'color_pars_fragment'] = "#ifdef USE_COLOR\n\n	varying vec3 vColor;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/color_vertex.glsl

THREE.ShaderChunk[ 'color_vertex'] = "#ifdef USE_COLOR\n\n	#ifdef GAMMA_INPUT\n\n		vColor = color * color;\n\n	#else\n\n		vColor = color;\n\n	#endif\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/skinning_vertex.glsl

THREE.ShaderChunk[ 'skinning_vertex'] = "#ifdef USE_SKINNING\n\n	#ifdef USE_MORPHTARGETS\n\n	vec4 skinVertex = bindMatrix * vec4( morphed, 1.0 );\n\n	#else\n\n	vec4 skinVertex = bindMatrix * vec4( position, 1.0 );\n\n	#endif\n\n	vec4 skinned = vec4( 0.0 );\n	skinned += boneMatX * skinVertex * skinWeight.x;\n	skinned += boneMatY * skinVertex * skinWeight.y;\n	skinned += boneMatZ * skinVertex * skinWeight.z;\n	skinned += boneMatW * skinVertex * skinWeight.w;\n	skinned  = bindMatrixInverse * skinned;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/envmap_pars_vertex.glsl

THREE.ShaderChunk[ 'envmap_pars_vertex'] = "#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP ) && ! defined( PHONG )\n\n	varying vec3 vReflect;\n\n	uniform float refractionRatio;\n	uniform bool useRefract;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/linear_to_gamma_fragment.glsl

THREE.ShaderChunk[ 'linear_to_gamma_fragment'] = "#ifdef GAMMA_OUTPUT\n\n	gl_FragColor.xyz = sqrt( gl_FragColor.xyz );\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/color_pars_vertex.glsl

THREE.ShaderChunk[ 'color_pars_vertex'] = "#ifdef USE_COLOR\n\n	varying vec3 vColor;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/lights_lambert_pars_vertex.glsl

THREE.ShaderChunk[ 'lights_lambert_pars_vertex'] = "uniform vec3 ambient;\nuniform vec3 diffuse;\nuniform vec3 emissive;\n\nuniform vec3 ambientLightColor;\n\n#if MAX_DIR_LIGHTS > 0\n\n	uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\n	uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	uniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n	uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	uniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n\n#endif\n\n#ifdef WRAP_AROUND\n\n	uniform vec3 wrapRGB;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/map_pars_vertex.glsl

THREE.ShaderChunk[ 'map_pars_vertex'] = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP )\n\n	varying vec2 vUv;\n	uniform vec4 offsetRepeat;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/envmap_fragment.glsl

THREE.ShaderChunk[ 'envmap_fragment'] = "#ifdef USE_ENVMAP\n\n	vec3 reflectVec;\n\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n\n		vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );\n\n		// http://en.wikibooks.org/wiki/GLSL_Programming/Applying_Matrix_Transformations\n		// Transforming Normal Vectors with the Inverse Transformation\n\n		vec3 worldNormal = normalize( vec3( vec4( normal, 0.0 ) * viewMatrix ) );\n\n		if ( useRefract ) {\n\n			reflectVec = refract( cameraToVertex, worldNormal, refractionRatio );\n\n		} else { \n\n			reflectVec = reflect( cameraToVertex, worldNormal );\n\n		}\n\n	#else\n\n		reflectVec = vReflect;\n\n	#endif\n\n	#ifdef DOUBLE_SIDED\n\n		float flipNormal = ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n		vec4 cubeColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n\n	#else\n\n		vec4 cubeColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n\n	#endif\n\n	#ifdef GAMMA_INPUT\n\n		cubeColor.xyz *= cubeColor.xyz;\n\n	#endif\n\n	if ( combine == 1 ) {\n\n		gl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, specularStrength * reflectivity );\n\n	} else if ( combine == 2 ) {\n\n		gl_FragColor.xyz += cubeColor.xyz * specularStrength * reflectivity;\n\n	} else {\n\n		gl_FragColor.xyz = mix( gl_FragColor.xyz, gl_FragColor.xyz * cubeColor.xyz, specularStrength * reflectivity );\n\n	}\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/specularmap_pars_fragment.glsl

THREE.ShaderChunk[ 'specularmap_pars_fragment'] = "#ifdef USE_SPECULARMAP\n\n	uniform sampler2D specularMap;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/logdepthbuf_vertex.glsl

THREE.ShaderChunk[ 'logdepthbuf_vertex'] = "#ifdef USE_LOGDEPTHBUF\n\n	gl_Position.z = log2(max(1e-6, gl_Position.w + 1.0)) * logDepthBufFC;\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		vFragDepth = 1.0 + gl_Position.w;\n\n#else\n\n		gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;\n\n	#endif\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/morphtarget_pars_vertex.glsl

THREE.ShaderChunk[ 'morphtarget_pars_vertex'] = "#ifdef USE_MORPHTARGETS\n\n	#ifndef USE_MORPHNORMALS\n\n	uniform float morphTargetInfluences[ 8 ];\n\n	#else\n\n	uniform float morphTargetInfluences[ 4 ];\n\n	#endif\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/specularmap_fragment.glsl

THREE.ShaderChunk[ 'specularmap_fragment'] = "float specularStrength;\n\n#ifdef USE_SPECULARMAP\n\n	vec4 texelSpecular = texture2D( specularMap, vUv );\n	specularStrength = texelSpecular.r;\n\n#else\n\n	specularStrength = 1.0;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/fog_fragment.glsl

THREE.ShaderChunk[ 'fog_fragment'] = "#ifdef USE_FOG\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		float depth = gl_FragDepthEXT / gl_FragCoord.w;\n\n	#else\n\n		float depth = gl_FragCoord.z / gl_FragCoord.w;\n\n	#endif\n\n	#ifdef FOG_EXP2\n\n		const float LOG2 = 1.442695;\n		float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\n		fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n\n	#else\n\n		float fogFactor = smoothstep( fogNear, fogFar, depth );\n\n	#endif\n	\n	gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/bumpmap_pars_fragment.glsl

THREE.ShaderChunk[ 'bumpmap_pars_fragment'] = "#ifdef USE_BUMPMAP\n\n	uniform sampler2D bumpMap;\n	uniform float bumpScale;\n\n			// Derivative maps - bump mapping unparametrized surfaces by Morten Mikkelsen\n			//	http://mmikkelsen3d.blogspot.sk/2011/07/derivative-maps.html\n\n			// Evaluate the derivative of the height w.r.t. screen-space using forward differencing (listing 2)\n\n	vec2 dHdxy_fwd() {\n\n		vec2 dSTdx = dFdx( vUv );\n		vec2 dSTdy = dFdy( vUv );\n\n		float Hll = bumpScale * texture2D( bumpMap, vUv ).x;\n		float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;\n		float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;\n\n		return vec2( dBx, dBy );\n\n	}\n\n	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {\n\n		vec3 vSigmaX = dFdx( surf_pos );\n		vec3 vSigmaY = dFdy( surf_pos );\n		vec3 vN = surf_norm;		// normalized\n\n		vec3 R1 = cross( vSigmaY, vN );\n		vec3 R2 = cross( vN, vSigmaX );\n\n		float fDet = dot( vSigmaX, R1 );\n\n		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n		return normalize( abs( fDet ) * surf_norm - vGrad );\n\n	}\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/defaultnormal_vertex.glsl

THREE.ShaderChunk[ 'defaultnormal_vertex'] = "vec3 objectNormal;\n\n#ifdef USE_SKINNING\n\n	objectNormal = skinnedNormal.xyz;\n\n#endif\n\n#if !defined( USE_SKINNING ) && defined( USE_MORPHNORMALS )\n\n	objectNormal = morphedNormal;\n\n#endif\n\n#if !defined( USE_SKINNING ) && ! defined( USE_MORPHNORMALS )\n\n	objectNormal = normal;\n\n#endif\n\n#ifdef FLIP_SIDED\n\n	objectNormal = -objectNormal;\n\n#endif\n\nvec3 transformedNormal = normalMatrix * objectNormal;";

// File:src/renderers/shaders/ShaderChunk/lights_phong_pars_fragment.glsl

THREE.ShaderChunk[ 'lights_phong_pars_fragment'] = "uniform vec3 ambientLightColor;\n\n#if MAX_DIR_LIGHTS > 0\n\n	uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\n	uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	uniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n\n	uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	uniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n\n	uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\n	varying vec3 vWorldPosition;\n\n#endif\n\n#ifdef WRAP_AROUND\n\n	uniform vec3 wrapRGB;\n\n#endif\n\nvarying vec3 vViewPosition;\nvarying vec3 vNormal;";

// File:src/renderers/shaders/ShaderChunk/skinbase_vertex.glsl

THREE.ShaderChunk[ 'skinbase_vertex'] = "#ifdef USE_SKINNING\n\n	mat4 boneMatX = getBoneMatrix( skinIndex.x );\n	mat4 boneMatY = getBoneMatrix( skinIndex.y );\n	mat4 boneMatZ = getBoneMatrix( skinIndex.z );\n	mat4 boneMatW = getBoneMatrix( skinIndex.w );\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/map_vertex.glsl

THREE.ShaderChunk[ 'map_vertex'] = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP )\n\n	vUv = uv * offsetRepeat.zw + offsetRepeat.xy;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/lightmap_fragment.glsl

THREE.ShaderChunk[ 'lightmap_fragment'] = "#ifdef USE_LIGHTMAP\n\n	gl_FragColor = gl_FragColor * texture2D( lightMap, vUv2 );\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/shadowmap_pars_vertex.glsl

THREE.ShaderChunk[ 'shadowmap_pars_vertex'] = "#ifdef USE_SHADOWMAP\n\n	varying vec4 vShadowCoord[ MAX_SHADOWS ];\n	uniform mat4 shadowMatrix[ MAX_SHADOWS ];\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/color_fragment.glsl

THREE.ShaderChunk[ 'color_fragment'] = "#ifdef USE_COLOR\n\n	gl_FragColor = gl_FragColor * vec4( vColor, 1.0 );\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/morphtarget_vertex.glsl

THREE.ShaderChunk[ 'morphtarget_vertex'] = "#ifdef USE_MORPHTARGETS\n\n	vec3 morphed = vec3( 0.0 );\n	morphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\n	morphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\n	morphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\n	morphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\n\n	#ifndef USE_MORPHNORMALS\n\n	morphed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\n	morphed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\n	morphed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\n	morphed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\n\n	#endif\n\n	morphed += position;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/envmap_vertex.glsl

THREE.ShaderChunk[ 'envmap_vertex'] = "#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP ) && ! defined( PHONG )\n\n	vec3 worldNormal = mat3( modelMatrix[ 0 ].xyz, modelMatrix[ 1 ].xyz, modelMatrix[ 2 ].xyz ) * objectNormal;\n	worldNormal = normalize( worldNormal );\n\n	vec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n\n	if ( useRefract ) {\n\n		vReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n\n	} else {\n\n		vReflect = reflect( cameraToVertex, worldNormal );\n\n	}\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/shadowmap_fragment.glsl

THREE.ShaderChunk[ 'shadowmap_fragment'] = "#ifdef USE_SHADOWMAP\n\n	#ifdef SHADOWMAP_DEBUG\n\n		vec3 frustumColors[3];\n		frustumColors[0] = vec3( 1.0, 0.5, 0.0 );\n		frustumColors[1] = vec3( 0.0, 1.0, 0.8 );\n		frustumColors[2] = vec3( 0.0, 0.5, 1.0 );\n\n	#endif\n\n	#ifdef SHADOWMAP_CASCADE\n\n		int inFrustumCount = 0;\n\n	#endif\n\n	float fDepth;\n	vec3 shadowColor = vec3( 1.0 );\n\n	for( int i = 0; i < MAX_SHADOWS; i ++ ) {\n\n		vec3 shadowCoord = vShadowCoord[ i ].xyz / vShadowCoord[ i ].w;\n\n				// if ( something && something ) breaks ATI OpenGL shader compiler\n				// if ( all( something, something ) ) using this instead\n\n		bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n		bool inFrustum = all( inFrustumVec );\n\n				// don't shadow pixels outside of light frustum\n				// use just first frustum (for cascades)\n				// don't shadow pixels behind far plane of light frustum\n\n		#ifdef SHADOWMAP_CASCADE\n\n			inFrustumCount += int( inFrustum );\n			bvec3 frustumTestVec = bvec3( inFrustum, inFrustumCount == 1, shadowCoord.z <= 1.0 );\n\n		#else\n\n			bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n\n		#endif\n\n		bool frustumTest = all( frustumTestVec );\n\n		if ( frustumTest ) {\n\n			shadowCoord.z += shadowBias[ i ];\n\n			#if defined( SHADOWMAP_TYPE_PCF )\n\n						// Percentage-close filtering\n						// (9 pixel kernel)\n						// http://fabiensanglard.net/shadowmappingPCF/\n\n				float shadow = 0.0;\n\n		/*\n						// nested loops breaks shader compiler / validator on some ATI cards when using OpenGL\n						// must enroll loop manually\n\n				for ( float y = -1.25; y <= 1.25; y += 1.25 )\n					for ( float x = -1.25; x <= 1.25; x += 1.25 ) {\n\n						vec4 rgbaDepth = texture2D( shadowMap[ i ], vec2( x * xPixelOffset, y * yPixelOffset ) + shadowCoord.xy );\n\n								// doesn't seem to produce any noticeable visual difference compared to simple texture2D lookup\n								//vec4 rgbaDepth = texture2DProj( shadowMap[ i ], vec4( vShadowCoord[ i ].w * ( vec2( x * xPixelOffset, y * yPixelOffset ) + shadowCoord.xy ), 0.05, vShadowCoord[ i ].w ) );\n\n						float fDepth = unpackDepth( rgbaDepth );\n\n						if ( fDepth < shadowCoord.z )\n							shadow += 1.0;\n\n				}\n\n				shadow /= 9.0;\n\n		*/\n\n				const float shadowDelta = 1.0 / 9.0;\n\n				float xPixelOffset = 1.0 / shadowMapSize[ i ].x;\n				float yPixelOffset = 1.0 / shadowMapSize[ i ].y;\n\n				float dx0 = -1.25 * xPixelOffset;\n				float dy0 = -1.25 * yPixelOffset;\n				float dx1 = 1.25 * xPixelOffset;\n				float dy1 = 1.25 * yPixelOffset;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				shadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n\n			#elif defined( SHADOWMAP_TYPE_PCF_SOFT )\n\n						// Percentage-close filtering\n						// (9 pixel kernel)\n						// http://fabiensanglard.net/shadowmappingPCF/\n\n				float shadow = 0.0;\n\n				float xPixelOffset = 1.0 / shadowMapSize[ i ].x;\n				float yPixelOffset = 1.0 / shadowMapSize[ i ].y;\n\n				float dx0 = -1.0 * xPixelOffset;\n				float dy0 = -1.0 * yPixelOffset;\n				float dx1 = 1.0 * xPixelOffset;\n				float dy1 = 1.0 * yPixelOffset;\n\n				mat3 shadowKernel;\n				mat3 depthKernel;\n\n				depthKernel[0][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\n				depthKernel[0][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\n				depthKernel[0][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\n				depthKernel[1][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\n				depthKernel[1][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\n				depthKernel[1][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\n				depthKernel[2][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\n				depthKernel[2][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\n				depthKernel[2][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\n\n				vec3 shadowZ = vec3( shadowCoord.z );\n				shadowKernel[0] = vec3(lessThan(depthKernel[0], shadowZ ));\n				shadowKernel[0] *= vec3(0.25);\n\n				shadowKernel[1] = vec3(lessThan(depthKernel[1], shadowZ ));\n				shadowKernel[1] *= vec3(0.25);\n\n				shadowKernel[2] = vec3(lessThan(depthKernel[2], shadowZ ));\n				shadowKernel[2] *= vec3(0.25);\n\n				vec2 fractionalCoord = 1.0 - fract( shadowCoord.xy * shadowMapSize[i].xy );\n\n				shadowKernel[0] = mix( shadowKernel[1], shadowKernel[0], fractionalCoord.x );\n				shadowKernel[1] = mix( shadowKernel[2], shadowKernel[1], fractionalCoord.x );\n\n				vec4 shadowValues;\n				shadowValues.x = mix( shadowKernel[0][1], shadowKernel[0][0], fractionalCoord.y );\n				shadowValues.y = mix( shadowKernel[0][2], shadowKernel[0][1], fractionalCoord.y );\n				shadowValues.z = mix( shadowKernel[1][1], shadowKernel[1][0], fractionalCoord.y );\n				shadowValues.w = mix( shadowKernel[1][2], shadowKernel[1][1], fractionalCoord.y );\n\n				shadow = dot( shadowValues, vec4( 1.0 ) );\n\n				shadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n\n			#else\n\n				vec4 rgbaDepth = texture2D( shadowMap[ i ], shadowCoord.xy );\n				float fDepth = unpackDepth( rgbaDepth );\n\n				if ( fDepth < shadowCoord.z )\n\n		// spot with multiple shadows is darker\n\n					shadowColor = shadowColor * vec3( 1.0 - shadowDarkness[ i ] );\n\n		// spot with multiple shadows has the same color as single shadow spot\n\n		// 					shadowColor = min( shadowColor, vec3( shadowDarkness[ i ] ) );\n\n			#endif\n\n		}\n\n\n		#ifdef SHADOWMAP_DEBUG\n\n			#ifdef SHADOWMAP_CASCADE\n\n				if ( inFrustum && inFrustumCount == 1 ) gl_FragColor.xyz *= frustumColors[ i ];\n\n			#else\n\n				if ( inFrustum ) gl_FragColor.xyz *= frustumColors[ i ];\n\n			#endif\n\n		#endif\n\n	}\n\n	#ifdef GAMMA_OUTPUT\n\n		shadowColor *= shadowColor;\n\n	#endif\n\n	gl_FragColor.xyz = gl_FragColor.xyz * shadowColor;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/worldpos_vertex.glsl

THREE.ShaderChunk[ 'worldpos_vertex'] = "#if defined( USE_ENVMAP ) || defined( PHONG ) || defined( LAMBERT ) || defined ( USE_SHADOWMAP )\n\n	#ifdef USE_SKINNING\n\n		vec4 worldPosition = modelMatrix * skinned;\n\n	#endif\n\n	#if defined( USE_MORPHTARGETS ) && ! defined( USE_SKINNING )\n\n		vec4 worldPosition = modelMatrix * vec4( morphed, 1.0 );\n\n	#endif\n\n	#if ! defined( USE_MORPHTARGETS ) && ! defined( USE_SKINNING )\n\n		vec4 worldPosition = modelMatrix * vec4( position, 1.0 );\n\n	#endif\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl

THREE.ShaderChunk[ 'shadowmap_pars_fragment'] = "#ifdef USE_SHADOWMAP\n\n	uniform sampler2D shadowMap[ MAX_SHADOWS ];\n	uniform vec2 shadowMapSize[ MAX_SHADOWS ];\n\n	uniform float shadowDarkness[ MAX_SHADOWS ];\n	uniform float shadowBias[ MAX_SHADOWS ];\n\n	varying vec4 vShadowCoord[ MAX_SHADOWS ];\n\n	float unpackDepth( const in vec4 rgba_depth ) {\n\n		const vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\n		float depth = dot( rgba_depth, bit_shift );\n		return depth;\n\n	}\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/skinning_pars_vertex.glsl

THREE.ShaderChunk[ 'skinning_pars_vertex'] = "#ifdef USE_SKINNING\n\n	uniform mat4 bindMatrix;\n	uniform mat4 bindMatrixInverse;\n\n	#ifdef BONE_TEXTURE\n\n		uniform sampler2D boneTexture;\n		uniform int boneTextureWidth;\n		uniform int boneTextureHeight;\n\n		mat4 getBoneMatrix( const in float i ) {\n\n			float j = i * 4.0;\n			float x = mod( j, float( boneTextureWidth ) );\n			float y = floor( j / float( boneTextureWidth ) );\n\n			float dx = 1.0 / float( boneTextureWidth );\n			float dy = 1.0 / float( boneTextureHeight );\n\n			y = dy * ( y + 0.5 );\n\n			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\n			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\n			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\n			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\n\n			mat4 bone = mat4( v1, v2, v3, v4 );\n\n			return bone;\n\n		}\n\n	#else\n\n		uniform mat4 boneGlobalMatrices[ MAX_BONES ];\n\n		mat4 getBoneMatrix( const in float i ) {\n\n			mat4 bone = boneGlobalMatrices[ int(i) ];\n			return bone;\n\n		}\n\n	#endif\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/logdepthbuf_pars_fragment.glsl

THREE.ShaderChunk[ 'logdepthbuf_pars_fragment'] = "#ifdef USE_LOGDEPTHBUF\n\n	uniform float logDepthBufFC;\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		#extension GL_EXT_frag_depth : enable\n		varying float vFragDepth;\n\n	#endif\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/alphamap_fragment.glsl

THREE.ShaderChunk[ 'alphamap_fragment'] = "#ifdef USE_ALPHAMAP\n\n	gl_FragColor.a *= texture2D( alphaMap, vUv ).g;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/alphamap_pars_fragment.glsl

THREE.ShaderChunk[ 'alphamap_pars_fragment'] = "#ifdef USE_ALPHAMAP\n\n	uniform sampler2D alphaMap;\n\n#endif\n";

// File:src/renderers/shaders/UniformsUtils.js

/**
 * Uniform Utilities
 */

THREE.UniformsUtils = {

	merge: function ( uniforms ) {

		var merged = {};

		for ( var u = 0; u < uniforms.length; u ++ ) {

			var tmp = this.clone( uniforms[ u ] );

			for ( var p in tmp ) {

				merged[ p ] = tmp[ p ];

			}

		}

		return merged;

	},

	clone: function ( uniforms_src ) {

		var uniforms_dst = {};

		for ( var u in uniforms_src ) {

			uniforms_dst[ u ] = {};

			for ( var p in uniforms_src[ u ] ) {

				var parameter_src = uniforms_src[ u ][ p ];

				if ( parameter_src instanceof THREE.Color ||
					 parameter_src instanceof THREE.Vector2 ||
					 parameter_src instanceof THREE.Vector3 ||
					 parameter_src instanceof THREE.Vector4 ||
					 parameter_src instanceof THREE.Matrix4 ||
					 parameter_src instanceof THREE.Texture ) {

					uniforms_dst[ u ][ p ] = parameter_src.clone();

				} else if ( parameter_src instanceof Array ) {

					uniforms_dst[ u ][ p ] = parameter_src.slice();

				} else {

					uniforms_dst[ u ][ p ] = parameter_src;

				}

			}

		}

		return uniforms_dst;

	}

};

// File:src/renderers/shaders/UniformsLib.js

/**
 * Uniforms library for shared webgl shaders
 */

THREE.UniformsLib = {

	common: {

		"diffuse" : { type: "c", value: new THREE.Color( 0xeeeeee ) },
		"opacity" : { type: "f", value: 1.0 },

		"map" : { type: "t", value: null },
		"offsetRepeat" : { type: "v4", value: new THREE.Vector4( 0, 0, 1, 1 ) },

		"lightMap" : { type: "t", value: null },
		"specularMap" : { type: "t", value: null },
		"alphaMap" : { type: "t", value: null },

		"envMap" : { type: "t", value: null },
		"flipEnvMap" : { type: "f", value: - 1 },
		"useRefract" : { type: "i", value: 0 },
		"reflectivity" : { type: "f", value: 1.0 },
		"refractionRatio" : { type: "f", value: 0.98 },
		"combine" : { type: "i", value: 0 },

		"morphTargetInfluences" : { type: "f", value: 0 }

	},

	bump: {

		"bumpMap" : { type: "t", value: null },
		"bumpScale" : { type: "f", value: 1 }

	},

	normalmap: {

		"normalMap" : { type: "t", value: null },
		"normalScale" : { type: "v2", value: new THREE.Vector2( 1, 1 ) }
	},

	fog : {

		"fogDensity" : { type: "f", value: 0.00025 },
		"fogNear" : { type: "f", value: 1 },
		"fogFar" : { type: "f", value: 2000 },
		"fogColor" : { type: "c", value: new THREE.Color( 0xffffff ) }

	},

	lights: {

		"ambientLightColor" : { type: "fv", value: [] },

		"directionalLightDirection" : { type: "fv", value: [] },
		"directionalLightColor" : { type: "fv", value: [] },

		"hemisphereLightDirection" : { type: "fv", value: [] },
		"hemisphereLightSkyColor" : { type: "fv", value: [] },
		"hemisphereLightGroundColor" : { type: "fv", value: [] },

		"pointLightColor" : { type: "fv", value: [] },
		"pointLightPosition" : { type: "fv", value: [] },
		"pointLightDistance" : { type: "fv1", value: [] },

		"spotLightColor" : { type: "fv", value: [] },
		"spotLightPosition" : { type: "fv", value: [] },
		"spotLightDirection" : { type: "fv", value: [] },
		"spotLightDistance" : { type: "fv1", value: [] },
		"spotLightAngleCos" : { type: "fv1", value: [] },
		"spotLightExponent" : { type: "fv1", value: [] }

	},

	particle: {

		"psColor" : { type: "c", value: new THREE.Color( 0xeeeeee ) },
		"opacity" : { type: "f", value: 1.0 },
		"size" : { type: "f", value: 1.0 },
		"scale" : { type: "f", value: 1.0 },
		"map" : { type: "t", value: null },

		"fogDensity" : { type: "f", value: 0.00025 },
		"fogNear" : { type: "f", value: 1 },
		"fogFar" : { type: "f", value: 2000 },
		"fogColor" : { type: "c", value: new THREE.Color( 0xffffff ) }

	},

	shadowmap: {

		"shadowMap": { type: "tv", value: [] },
		"shadowMapSize": { type: "v2v", value: [] },

		"shadowBias" : { type: "fv1", value: [] },
		"shadowDarkness": { type: "fv1", value: [] },

		"shadowMatrix" : { type: "m4v", value: [] }

	}

};

// File:src/renderers/shaders/ShaderLib.js

/**
 * Webgl Shader Library for three.js
 *
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 */


THREE.ShaderLib = {

	'basic': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "common" ],
			THREE.UniformsLib[ "fog" ],
			THREE.UniformsLib[ "shadowmap" ]

		] ),

		vertexShader: [

			THREE.ShaderChunk[ "map_pars_vertex" ],
			THREE.ShaderChunk[ "lightmap_pars_vertex" ],
			THREE.ShaderChunk[ "envmap_pars_vertex" ],
			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "map_vertex" ],
				THREE.ShaderChunk[ "lightmap_vertex" ],
				THREE.ShaderChunk[ "color_vertex" ],
				THREE.ShaderChunk[ "skinbase_vertex" ],

			"	#ifdef USE_ENVMAP",

				THREE.ShaderChunk[ "morphnormal_vertex" ],
				THREE.ShaderChunk[ "skinnormal_vertex" ],
				THREE.ShaderChunk[ "defaultnormal_vertex" ],

			"	#endif",

				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "skinning_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

				THREE.ShaderChunk[ "worldpos_vertex" ],
				THREE.ShaderChunk[ "envmap_vertex" ],
				THREE.ShaderChunk[ "shadowmap_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform vec3 diffuse;",
			"uniform float opacity;",

			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_pars_fragment" ],
			THREE.ShaderChunk[ "alphamap_pars_fragment" ],
			THREE.ShaderChunk[ "lightmap_pars_fragment" ],
			THREE.ShaderChunk[ "envmap_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
			THREE.ShaderChunk[ "specularmap_pars_fragment" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

			"	gl_FragColor = vec4( diffuse, opacity );",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],
				THREE.ShaderChunk[ "map_fragment" ],
				THREE.ShaderChunk[ "alphamap_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],
				THREE.ShaderChunk[ "specularmap_fragment" ],
				THREE.ShaderChunk[ "lightmap_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				THREE.ShaderChunk[ "envmap_fragment" ],
				THREE.ShaderChunk[ "shadowmap_fragment" ],

				THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

				THREE.ShaderChunk[ "fog_fragment" ],

			"}"

		].join("\n")

	},

	'lambert': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "common" ],
			THREE.UniformsLib[ "fog" ],
			THREE.UniformsLib[ "lights" ],
			THREE.UniformsLib[ "shadowmap" ],

			{
				"ambient"  : { type: "c", value: new THREE.Color( 0xffffff ) },
				"emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
				"wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }
			}

		] ),

		vertexShader: [

			"#define LAMBERT",

			"varying vec3 vLightFront;",

			"#ifdef DOUBLE_SIDED",

			"	varying vec3 vLightBack;",

			"#endif",

			THREE.ShaderChunk[ "map_pars_vertex" ],
			THREE.ShaderChunk[ "lightmap_pars_vertex" ],
			THREE.ShaderChunk[ "envmap_pars_vertex" ],
			THREE.ShaderChunk[ "lights_lambert_pars_vertex" ],
			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "map_vertex" ],
				THREE.ShaderChunk[ "lightmap_vertex" ],
				THREE.ShaderChunk[ "color_vertex" ],

				THREE.ShaderChunk[ "morphnormal_vertex" ],
				THREE.ShaderChunk[ "skinbase_vertex" ],
				THREE.ShaderChunk[ "skinnormal_vertex" ],
				THREE.ShaderChunk[ "defaultnormal_vertex" ],

				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "skinning_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

				THREE.ShaderChunk[ "worldpos_vertex" ],
				THREE.ShaderChunk[ "envmap_vertex" ],
				THREE.ShaderChunk[ "lights_lambert_vertex" ],
				THREE.ShaderChunk[ "shadowmap_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform float opacity;",

			"varying vec3 vLightFront;",

			"#ifdef DOUBLE_SIDED",

			"	varying vec3 vLightBack;",

			"#endif",

			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_pars_fragment" ],
			THREE.ShaderChunk[ "alphamap_pars_fragment" ],
			THREE.ShaderChunk[ "lightmap_pars_fragment" ],
			THREE.ShaderChunk[ "envmap_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
			THREE.ShaderChunk[ "specularmap_pars_fragment" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

			"	gl_FragColor = vec4( vec3( 1.0 ), opacity );",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],
				THREE.ShaderChunk[ "map_fragment" ],
				THREE.ShaderChunk[ "alphamap_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],
				THREE.ShaderChunk[ "specularmap_fragment" ],

			"	#ifdef DOUBLE_SIDED",

					//"float isFront = float( gl_FrontFacing );",
					//"gl_FragColor.xyz *= isFront * vLightFront + ( 1.0 - isFront ) * vLightBack;",

			"		if ( gl_FrontFacing )",
			"			gl_FragColor.xyz *= vLightFront;",
			"		else",
			"			gl_FragColor.xyz *= vLightBack;",

			"	#else",

			"		gl_FragColor.xyz *= vLightFront;",

			"	#endif",

				THREE.ShaderChunk[ "lightmap_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				THREE.ShaderChunk[ "envmap_fragment" ],
				THREE.ShaderChunk[ "shadowmap_fragment" ],

				THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

				THREE.ShaderChunk[ "fog_fragment" ],

			"}"

		].join("\n")

	},

	'phong': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "common" ],
			THREE.UniformsLib[ "bump" ],
			THREE.UniformsLib[ "normalmap" ],
			THREE.UniformsLib[ "fog" ],
			THREE.UniformsLib[ "lights" ],
			THREE.UniformsLib[ "shadowmap" ],

			{
				"ambient"  : { type: "c", value: new THREE.Color( 0xffffff ) },
				"emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
				"specular" : { type: "c", value: new THREE.Color( 0x111111 ) },
				"shininess": { type: "f", value: 30 },
				"wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }
			}

		] ),

		vertexShader: [

			"#define PHONG",

			"varying vec3 vViewPosition;",
			"varying vec3 vNormal;",

			THREE.ShaderChunk[ "map_pars_vertex" ],
			THREE.ShaderChunk[ "lightmap_pars_vertex" ],
			THREE.ShaderChunk[ "envmap_pars_vertex" ],
			THREE.ShaderChunk[ "lights_phong_pars_vertex" ],
			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "map_vertex" ],
				THREE.ShaderChunk[ "lightmap_vertex" ],
				THREE.ShaderChunk[ "color_vertex" ],

				THREE.ShaderChunk[ "morphnormal_vertex" ],
				THREE.ShaderChunk[ "skinbase_vertex" ],
				THREE.ShaderChunk[ "skinnormal_vertex" ],
				THREE.ShaderChunk[ "defaultnormal_vertex" ],

			"	vNormal = normalize( transformedNormal );",

				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "skinning_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

			"	vViewPosition = -mvPosition.xyz;",

				THREE.ShaderChunk[ "worldpos_vertex" ],
				THREE.ShaderChunk[ "envmap_vertex" ],
				THREE.ShaderChunk[ "lights_phong_vertex" ],
				THREE.ShaderChunk[ "shadowmap_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"#define PHONG",

			"uniform vec3 diffuse;",
			"uniform float opacity;",

			"uniform vec3 ambient;",
			"uniform vec3 emissive;",
			"uniform vec3 specular;",
			"uniform float shininess;",

			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_pars_fragment" ],
			THREE.ShaderChunk[ "alphamap_pars_fragment" ],
			THREE.ShaderChunk[ "lightmap_pars_fragment" ],
			THREE.ShaderChunk[ "envmap_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "lights_phong_pars_fragment" ],
			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
			THREE.ShaderChunk[ "bumpmap_pars_fragment" ],
			THREE.ShaderChunk[ "normalmap_pars_fragment" ],
			THREE.ShaderChunk[ "specularmap_pars_fragment" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

			"	gl_FragColor = vec4( vec3( 1.0 ), opacity );",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],
				THREE.ShaderChunk[ "map_fragment" ],
				THREE.ShaderChunk[ "alphamap_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],
				THREE.ShaderChunk[ "specularmap_fragment" ],

				THREE.ShaderChunk[ "lights_phong_fragment" ],

				THREE.ShaderChunk[ "lightmap_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				THREE.ShaderChunk[ "envmap_fragment" ],
				THREE.ShaderChunk[ "shadowmap_fragment" ],

				THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

				THREE.ShaderChunk[ "fog_fragment" ],

			"}"

		].join("\n")

	},

	'particle_basic': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "particle" ],
			THREE.UniformsLib[ "shadowmap" ]

		] ),

		vertexShader: [

			"uniform float size;",
			"uniform float scale;",

			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "color_vertex" ],

			"	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

			"	#ifdef USE_SIZEATTENUATION",
			"		gl_PointSize = size * ( scale / length( mvPosition.xyz ) );",
			"	#else",
			"		gl_PointSize = size;",
			"	#endif",

			"	gl_Position = projectionMatrix * mvPosition;",

				THREE.ShaderChunk[ "logdepthbuf_vertex" ],
				THREE.ShaderChunk[ "worldpos_vertex" ],
				THREE.ShaderChunk[ "shadowmap_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform vec3 psColor;",
			"uniform float opacity;",

			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_particle_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

			"	gl_FragColor = vec4( psColor, opacity );",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],
				THREE.ShaderChunk[ "map_particle_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				THREE.ShaderChunk[ "shadowmap_fragment" ],
				THREE.ShaderChunk[ "fog_fragment" ],

			"}"

		].join("\n")

	},

	'dashed': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "common" ],
			THREE.UniformsLib[ "fog" ],

			{
				"scale"    : { type: "f", value: 1 },
				"dashSize" : { type: "f", value: 1 },
				"totalSize": { type: "f", value: 2 }
			}

		] ),

		vertexShader: [

			"uniform float scale;",
			"attribute float lineDistance;",

			"varying float vLineDistance;",

			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "color_vertex" ],

			"	vLineDistance = scale * lineDistance;",

			"	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
			"	gl_Position = projectionMatrix * mvPosition;",

				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform vec3 diffuse;",
			"uniform float opacity;",

			"uniform float dashSize;",
			"uniform float totalSize;",

			"varying float vLineDistance;",

			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

			"	if ( mod( vLineDistance, totalSize ) > dashSize ) {",

			"		discard;",

			"	}",

			"	gl_FragColor = vec4( diffuse, opacity );",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				THREE.ShaderChunk[ "fog_fragment" ],

			"}"

		].join("\n")

	},

	'depth': {

		uniforms: {

			"mNear": { type: "f", value: 1.0 },
			"mFar" : { type: "f", value: 2000.0 },
			"opacity" : { type: "f", value: 1.0 }

		},

		vertexShader: [

			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform float mNear;",
			"uniform float mFar;",
			"uniform float opacity;",

			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],

			"	#ifdef USE_LOGDEPTHBUF_EXT",

			"		float depth = gl_FragDepthEXT / gl_FragCoord.w;",

			"	#else",

			"		float depth = gl_FragCoord.z / gl_FragCoord.w;",

			"	#endif",

			"	float color = 1.0 - smoothstep( mNear, mFar, depth );",
			"	gl_FragColor = vec4( vec3( color ), opacity );",

			"}"

		].join("\n")

	},

	'normal': {

		uniforms: {

			"opacity" : { type: "f", value: 1.0 }

		},

		vertexShader: [

			"varying vec3 vNormal;",

			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

			"	vNormal = normalize( normalMatrix * normal );",

				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform float opacity;",
			"varying vec3 vNormal;",

			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

			"	gl_FragColor = vec4( 0.5 * normalize( vNormal ) + 0.5, opacity );",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],

			"}"

		].join("\n")

	},

	/* -------------------------------------------------------------------------
	//	Normal map shader
	//		- Blinn-Phong
	//		- normal + diffuse + specular + AO + displacement + reflection + shadow maps
	//		- point and directional lights (use with "lights: true" material option)
	 ------------------------------------------------------------------------- */

	'normalmap' : {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "fog" ],
			THREE.UniformsLib[ "lights" ],
			THREE.UniformsLib[ "shadowmap" ],

			{

			"enableAO"          : { type: "i", value: 0 },
			"enableDiffuse"     : { type: "i", value: 0 },
			"enableSpecular"    : { type: "i", value: 0 },
			"enableReflection"  : { type: "i", value: 0 },
			"enableDisplacement": { type: "i", value: 0 },

			"tDisplacement": { type: "t", value: null }, // must go first as this is vertex texture
			"tDiffuse"     : { type: "t", value: null },
			"tCube"        : { type: "t", value: null },
			"tNormal"      : { type: "t", value: null },
			"tSpecular"    : { type: "t", value: null },
			"tAO"          : { type: "t", value: null },

			"uNormalScale": { type: "v2", value: new THREE.Vector2( 1, 1 ) },

			"uDisplacementBias": { type: "f", value: 0.0 },
			"uDisplacementScale": { type: "f", value: 1.0 },

			"diffuse": { type: "c", value: new THREE.Color( 0xffffff ) },
			"specular": { type: "c", value: new THREE.Color( 0x111111 ) },
			"ambient": { type: "c", value: new THREE.Color( 0xffffff ) },
			"shininess": { type: "f", value: 30 },
			"opacity": { type: "f", value: 1 },

			"useRefract": { type: "i", value: 0 },
			"refractionRatio": { type: "f", value: 0.98 },
			"reflectivity": { type: "f", value: 0.5 },

			"uOffset" : { type: "v2", value: new THREE.Vector2( 0, 0 ) },
			"uRepeat" : { type: "v2", value: new THREE.Vector2( 1, 1 ) },

			"wrapRGB" : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }

			}

		] ),

		fragmentShader: [

			"uniform vec3 ambient;",
			"uniform vec3 diffuse;",
			"uniform vec3 specular;",
			"uniform float shininess;",
			"uniform float opacity;",

			"uniform bool enableDiffuse;",
			"uniform bool enableSpecular;",
			"uniform bool enableAO;",
			"uniform bool enableReflection;",

			"uniform sampler2D tDiffuse;",
			"uniform sampler2D tNormal;",
			"uniform sampler2D tSpecular;",
			"uniform sampler2D tAO;",

			"uniform samplerCube tCube;",

			"uniform vec2 uNormalScale;",

			"uniform bool useRefract;",
			"uniform float refractionRatio;",
			"uniform float reflectivity;",

			"varying vec3 vTangent;",
			"varying vec3 vBinormal;",
			"varying vec3 vNormal;",
			"varying vec2 vUv;",

			"uniform vec3 ambientLightColor;",

			"#if MAX_DIR_LIGHTS > 0",

			"	uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];",
			"	uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];",

			"#endif",

			"#if MAX_HEMI_LIGHTS > 0",

			"	uniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];",
			"	uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];",
			"	uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];",

			"#endif",

			"#if MAX_POINT_LIGHTS > 0",

			"	uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];",
			"	uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];",
			"	uniform float pointLightDistance[ MAX_POINT_LIGHTS ];",

			"#endif",

			"#if MAX_SPOT_LIGHTS > 0",

			"	uniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];",
			"	uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];",
			"	uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];",
			"	uniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];",
			"	uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];",
			"	uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];",

			"#endif",

			"#ifdef WRAP_AROUND",

			"	uniform vec3 wrapRGB;",

			"#endif",

			"varying vec3 vWorldPosition;",
			"varying vec3 vViewPosition;",

			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",
				THREE.ShaderChunk[ "logdepthbuf_fragment" ],

			"	gl_FragColor = vec4( vec3( 1.0 ), opacity );",

			"	vec3 specularTex = vec3( 1.0 );",

			"	vec3 normalTex = texture2D( tNormal, vUv ).xyz * 2.0 - 1.0;",
			"	normalTex.xy *= uNormalScale;",
			"	normalTex = normalize( normalTex );",

			"	if( enableDiffuse ) {",

			"		#ifdef GAMMA_INPUT",

			"			vec4 texelColor = texture2D( tDiffuse, vUv );",
			"			texelColor.xyz *= texelColor.xyz;",

			"			gl_FragColor = gl_FragColor * texelColor;",

			"		#else",

			"			gl_FragColor = gl_FragColor * texture2D( tDiffuse, vUv );",

			"		#endif",

			"	}",

			"	if( enableAO ) {",

			"		#ifdef GAMMA_INPUT",

			"			vec4 aoColor = texture2D( tAO, vUv );",
			"			aoColor.xyz *= aoColor.xyz;",

			"			gl_FragColor.xyz = gl_FragColor.xyz * aoColor.xyz;",

			"		#else",

			"			gl_FragColor.xyz = gl_FragColor.xyz * texture2D( tAO, vUv ).xyz;",

			"		#endif",

			"	}",
			
			THREE.ShaderChunk[ "alphatest_fragment" ],

			"	if( enableSpecular )",
			"		specularTex = texture2D( tSpecular, vUv ).xyz;",

			"	mat3 tsb = mat3( normalize( vTangent ), normalize( vBinormal ), normalize( vNormal ) );",
			"	vec3 finalNormal = tsb * normalTex;",

			"	#ifdef FLIP_SIDED",

			"		finalNormal = -finalNormal;",

			"	#endif",

			"	vec3 normal = normalize( finalNormal );",
			"	vec3 viewPosition = normalize( vViewPosition );",

				// point lights

			"	#if MAX_POINT_LIGHTS > 0",

			"		vec3 pointDiffuse = vec3( 0.0 );",
			"		vec3 pointSpecular = vec3( 0.0 );",

			"		for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {",

			"			vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );",
			"			vec3 pointVector = lPosition.xyz + vViewPosition.xyz;",

			"			float pointDistance = 1.0;",
			"			if ( pointLightDistance[ i ] > 0.0 )",
			"				pointDistance = 1.0 - min( ( length( pointVector ) / pointLightDistance[ i ] ), 1.0 );",

			"			pointVector = normalize( pointVector );",

						// diffuse

			"			#ifdef WRAP_AROUND",

			"				float pointDiffuseWeightFull = max( dot( normal, pointVector ), 0.0 );",
			"				float pointDiffuseWeightHalf = max( 0.5 * dot( normal, pointVector ) + 0.5, 0.0 );",

			"				vec3 pointDiffuseWeight = mix( vec3( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );",

			"			#else",

			"				float pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );",

			"			#endif",

			"			pointDiffuse += pointDistance * pointLightColor[ i ] * diffuse * pointDiffuseWeight;",

						// specular

			"			vec3 pointHalfVector = normalize( pointVector + viewPosition );",
			"			float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );",
			"			float pointSpecularWeight = specularTex.r * max( pow( pointDotNormalHalf, shininess ), 0.0 );",

			"			float specularNormalization = ( shininess + 2.0 ) / 8.0;",

			"			vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( pointVector, pointHalfVector ), 0.0 ), 5.0 );",
			"			pointSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * pointDistance * specularNormalization;",

			"		}",

			"	#endif",

				// spot lights

			"	#if MAX_SPOT_LIGHTS > 0",

			"		vec3 spotDiffuse = vec3( 0.0 );",
			"		vec3 spotSpecular = vec3( 0.0 );",

			"		for ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {",

			"			vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );",
			"			vec3 spotVector = lPosition.xyz + vViewPosition.xyz;",

			"			float spotDistance = 1.0;",
			"			if ( spotLightDistance[ i ] > 0.0 )",
			"				spotDistance = 1.0 - min( ( length( spotVector ) / spotLightDistance[ i ] ), 1.0 );",

			"			spotVector = normalize( spotVector );",

			"			float spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );",

			"			if ( spotEffect > spotLightAngleCos[ i ] ) {",

			"				spotEffect = max( pow( max( spotEffect, 0.0 ), spotLightExponent[ i ] ), 0.0 );",

							// diffuse

			"				#ifdef WRAP_AROUND",

			"					float spotDiffuseWeightFull = max( dot( normal, spotVector ), 0.0 );",
			"					float spotDiffuseWeightHalf = max( 0.5 * dot( normal, spotVector ) + 0.5, 0.0 );",

			"					vec3 spotDiffuseWeight = mix( vec3( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );",

			"				#else",

			"					float spotDiffuseWeight = max( dot( normal, spotVector ), 0.0 );",

			"				#endif",

			"				spotDiffuse += spotDistance * spotLightColor[ i ] * diffuse * spotDiffuseWeight * spotEffect;",

							// specular

			"				vec3 spotHalfVector = normalize( spotVector + viewPosition );",
			"				float spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );",
			"				float spotSpecularWeight = specularTex.r * max( pow( spotDotNormalHalf, shininess ), 0.0 );",

			"				float specularNormalization = ( shininess + 2.0 ) / 8.0;",

			"				vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( spotVector, spotHalfVector ), 0.0 ), 5.0 );",
			"				spotSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * spotDistance * specularNormalization * spotEffect;",

			"			}",

			"		}",

			"	#endif",

				// directional lights

			"	#if MAX_DIR_LIGHTS > 0",

			"		vec3 dirDiffuse = vec3( 0.0 );",
			"		vec3 dirSpecular = vec3( 0.0 );",

			"		for( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {",

			"			vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );",
			"			vec3 dirVector = normalize( lDirection.xyz );",

						// diffuse

			"			#ifdef WRAP_AROUND",

			"				float directionalLightWeightingFull = max( dot( normal, dirVector ), 0.0 );",
			"				float directionalLightWeightingHalf = max( 0.5 * dot( normal, dirVector ) + 0.5, 0.0 );",

			"				vec3 dirDiffuseWeight = mix( vec3( directionalLightWeightingFull ), vec3( directionalLightWeightingHalf ), wrapRGB );",

			"			#else",

			"				float dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );",

			"			#endif",

			"			dirDiffuse += directionalLightColor[ i ] * diffuse * dirDiffuseWeight;",

						// specular

			"			vec3 dirHalfVector = normalize( dirVector + viewPosition );",
			"			float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );",
			"			float dirSpecularWeight = specularTex.r * max( pow( dirDotNormalHalf, shininess ), 0.0 );",

			"			float specularNormalization = ( shininess + 2.0 ) / 8.0;",

			"			vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( dirVector, dirHalfVector ), 0.0 ), 5.0 );",
			"			dirSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;",

			"		}",

			"	#endif",

				// hemisphere lights

			"	#if MAX_HEMI_LIGHTS > 0",

			"		vec3 hemiDiffuse = vec3( 0.0 );",
			"		vec3 hemiSpecular = vec3( 0.0 );" ,

			"		for( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {",

			"			vec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );",
			"			vec3 lVector = normalize( lDirection.xyz );",

						// diffuse

			"			float dotProduct = dot( normal, lVector );",
			"			float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;",

			"			vec3 hemiColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );",

			"			hemiDiffuse += diffuse * hemiColor;",

						// specular (sky light)


			"			vec3 hemiHalfVectorSky = normalize( lVector + viewPosition );",
			"			float hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;",
			"			float hemiSpecularWeightSky = specularTex.r * max( pow( max( hemiDotNormalHalfSky, 0.0 ), shininess ), 0.0 );",

						// specular (ground light)

			"			vec3 lVectorGround = -lVector;",

			"			vec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );",
			"			float hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;",
			"			float hemiSpecularWeightGround = specularTex.r * max( pow( max( hemiDotNormalHalfGround, 0.0 ), shininess ), 0.0 );",

			"			float dotProductGround = dot( normal, lVectorGround );",

			"			float specularNormalization = ( shininess + 2.0 ) / 8.0;",

			"			vec3 schlickSky = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, hemiHalfVectorSky ), 0.0 ), 5.0 );",
			"			vec3 schlickGround = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVectorGround, hemiHalfVectorGround ), 0.0 ), 5.0 );",
			"			hemiSpecular += hemiColor * specularNormalization * ( schlickSky * hemiSpecularWeightSky * max( dotProduct, 0.0 ) + schlickGround * hemiSpecularWeightGround * max( dotProductGround, 0.0 ) );",

			"		}",

			"	#endif",

				// all lights contribution summation

			"	vec3 totalDiffuse = vec3( 0.0 );",
			"	vec3 totalSpecular = vec3( 0.0 );",

			"	#if MAX_DIR_LIGHTS > 0",

			"		totalDiffuse += dirDiffuse;",
			"		totalSpecular += dirSpecular;",

			"	#endif",

			"	#if MAX_HEMI_LIGHTS > 0",

			"		totalDiffuse += hemiDiffuse;",
			"		totalSpecular += hemiSpecular;",

			"	#endif",

			"	#if MAX_POINT_LIGHTS > 0",

			"		totalDiffuse += pointDiffuse;",
			"		totalSpecular += pointSpecular;",

			"	#endif",

			"	#if MAX_SPOT_LIGHTS > 0",

			"		totalDiffuse += spotDiffuse;",
			"		totalSpecular += spotSpecular;",

			"	#endif",

			"	#ifdef METAL",

			"		gl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * ambient + totalSpecular );",

			"	#else",

			"		gl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * ambient ) + totalSpecular;",

			"	#endif",

			"	if ( enableReflection ) {",

			"		vec3 vReflect;",
			"		vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );",

			"		if ( useRefract ) {",

			"			vReflect = refract( cameraToVertex, normal, refractionRatio );",

			"		} else {",

			"			vReflect = reflect( cameraToVertex, normal );",

			"		}",

			"		vec4 cubeColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );",

			"		#ifdef GAMMA_INPUT",

			"			cubeColor.xyz *= cubeColor.xyz;",

			"		#endif",

			"		gl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, specularTex.r * reflectivity );",

			"	}",

				THREE.ShaderChunk[ "shadowmap_fragment" ],
				THREE.ShaderChunk[ "linear_to_gamma_fragment" ],
				THREE.ShaderChunk[ "fog_fragment" ],

			"}"

		].join("\n"),

		vertexShader: [

			"attribute vec4 tangent;",

			"uniform vec2 uOffset;",
			"uniform vec2 uRepeat;",

			"uniform bool enableDisplacement;",

			"#ifdef VERTEX_TEXTURES",

			"	uniform sampler2D tDisplacement;",
			"	uniform float uDisplacementScale;",
			"	uniform float uDisplacementBias;",

			"#endif",

			"varying vec3 vTangent;",
			"varying vec3 vBinormal;",
			"varying vec3 vNormal;",
			"varying vec2 vUv;",

			"varying vec3 vWorldPosition;",
			"varying vec3 vViewPosition;",

			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "skinbase_vertex" ],
				THREE.ShaderChunk[ "skinnormal_vertex" ],

				// normal, tangent and binormal vectors

			"	#ifdef USE_SKINNING",

			"		vNormal = normalize( normalMatrix * skinnedNormal.xyz );",

			"		vec4 skinnedTangent = skinMatrix * vec4( tangent.xyz, 0.0 );",
			"		vTangent = normalize( normalMatrix * skinnedTangent.xyz );",

			"	#else",

			"		vNormal = normalize( normalMatrix * normal );",
			"		vTangent = normalize( normalMatrix * tangent.xyz );",

			"	#endif",

			"	vBinormal = normalize( cross( vNormal, vTangent ) * tangent.w );",

			"	vUv = uv * uRepeat + uOffset;",

				// displacement mapping

			"	vec3 displacedPosition;",

			"	#ifdef VERTEX_TEXTURES",

			"		if ( enableDisplacement ) {",

			"			vec3 dv = texture2D( tDisplacement, uv ).xyz;",
			"			float df = uDisplacementScale * dv.x + uDisplacementBias;",
			"			displacedPosition = position + normalize( normal ) * df;",

			"		} else {",

			"			#ifdef USE_SKINNING",

			"				vec4 skinVertex = bindMatrix * vec4( position, 1.0 );",

			"				vec4 skinned = vec4( 0.0 );",
			"				skinned += boneMatX * skinVertex * skinWeight.x;",
			"				skinned += boneMatY * skinVertex * skinWeight.y;",
			"				skinned += boneMatZ * skinVertex * skinWeight.z;",
			"				skinned += boneMatW * skinVertex * skinWeight.w;",
			"				skinned  = bindMatrixInverse * skinned;",

			"				displacedPosition = skinned.xyz;",

			"			#else",

			"				displacedPosition = position;",

			"			#endif",

			"		}",

			"	#else",

			"		#ifdef USE_SKINNING",

			"			vec4 skinVertex = bindMatrix * vec4( position, 1.0 );",

			"			vec4 skinned = vec4( 0.0 );",
			"			skinned += boneMatX * skinVertex * skinWeight.x;",
			"			skinned += boneMatY * skinVertex * skinWeight.y;",
			"			skinned += boneMatZ * skinVertex * skinWeight.z;",
			"			skinned += boneMatW * skinVertex * skinWeight.w;",
			"			skinned  = bindMatrixInverse * skinned;",

			"			displacedPosition = skinned.xyz;",

			"		#else",

			"			displacedPosition = position;",

			"		#endif",

			"	#endif",

				//

			"	vec4 mvPosition = modelViewMatrix * vec4( displacedPosition, 1.0 );",
			"	vec4 worldPosition = modelMatrix * vec4( displacedPosition, 1.0 );",

			"	gl_Position = projectionMatrix * mvPosition;",

				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

				//

			"	vWorldPosition = worldPosition.xyz;",
			"	vViewPosition = -mvPosition.xyz;",

				// shadows

			"	#ifdef USE_SHADOWMAP",

			"		for( int i = 0; i < MAX_SHADOWS; i ++ ) {",

			"			vShadowCoord[ i ] = shadowMatrix[ i ] * worldPosition;",

			"		}",

			"	#endif",

			"}"

		].join("\n")

	},

	/* -------------------------------------------------------------------------
	//	Cube map shader
	 ------------------------------------------------------------------------- */

	'cube': {

		uniforms: { "tCube": { type: "t", value: null },
					"tFlip": { type: "f", value: - 1 } },

		vertexShader: [

			"varying vec3 vWorldPosition;",

			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

			"	vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
			"	vWorldPosition = worldPosition.xyz;",

			"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform samplerCube tCube;",
			"uniform float tFlip;",

			"varying vec3 vWorldPosition;",

			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

			"	gl_FragColor = textureCube( tCube, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],

			"}"

		].join("\n")

	},

	/* Depth encoding into RGBA texture
	 *
	 * based on SpiderGL shadow map example
	 * http://spidergl.org/example.php?id=6
	 *
	 * originally from
	 * http://www.gamedev.net/topic/442138-packing-a-float-into-a-a8r8g8b8-texture-shader/page__whichpage__1%25EF%25BF%25BD
	 *
	 * see also
	 * http://aras-p.info/blog/2009/07/30/encoding-floats-to-rgba-the-final/
	 */

	'depthRGBA': {

		uniforms: {},

		vertexShader: [

			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "skinbase_vertex" ],
				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "skinning_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"vec4 pack_depth( const in float depth ) {",

			"	const vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );",
			"	const vec4 bit_mask = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );",
			"	vec4 res = mod( depth * bit_shift * vec4( 255 ), vec4( 256 ) ) / vec4( 255 );", // "	vec4 res = fract( depth * bit_shift );",
			"	res -= res.xxyz * bit_mask;",
			"	return res;",

			"}",

			"void main() {",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],

			"	#ifdef USE_LOGDEPTHBUF_EXT",

			"		gl_FragData[ 0 ] = pack_depth( gl_FragDepthEXT );",

			"	#else",

			"		gl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );",

			"	#endif",

				//"gl_FragData[ 0 ] = pack_depth( gl_FragCoord.z / gl_FragCoord.w );",
				//"float z = ( ( gl_FragCoord.z / gl_FragCoord.w ) - 3.0 ) / ( 4000.0 - 3.0 );",
				//"gl_FragData[ 0 ] = pack_depth( z );",
				//"gl_FragData[ 0 ] = vec4( z, z, z, 1.0 );",

			"}"

		].join("\n")

	}

};

// File:src/renderers/WebGLRenderer.js

/**
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author szimek / https://github.com/szimek/
 */

THREE.WebGLRenderer = function ( parameters ) {

	console.log( 'THREE.WebGLRenderer', THREE.REVISION );

	parameters = parameters || {};

	var _canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElement( 'canvas' ),
	_context = parameters.context !== undefined ? parameters.context : null,

	_precision = parameters.precision !== undefined ? parameters.precision : 'highp',

	_alpha = parameters.alpha !== undefined ? parameters.alpha : false,
	_depth = parameters.depth !== undefined ? parameters.depth : true,
	_stencil = parameters.stencil !== undefined ? parameters.stencil : true,
	_antialias = parameters.antialias !== undefined ? parameters.antialias : false,
	_premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true,
	_preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false,
	_logarithmicDepthBuffer = parameters.logarithmicDepthBuffer !== undefined ? parameters.logarithmicDepthBuffer : false,

	_clearColor = new THREE.Color( 0x000000 ),
	_clearAlpha = 0;

	var lights = [];

	var _webglObjects = {};
	var _webglObjectsImmediate = [];

	var opaqueObjects = [];
	var transparentObjects = [];

	var sprites = [];
	var lensFlares = [];

	// public properties

	this.domElement = _canvas;
	this.context = null;
	this.devicePixelRatio = parameters.devicePixelRatio !== undefined
				 ? parameters.devicePixelRatio
				 : self.devicePixelRatio !== undefined
					 ? self.devicePixelRatio
					 : 1;

	// clearing

	this.autoClear = true;
	this.autoClearColor = true;
	this.autoClearDepth = true;
	this.autoClearStencil = true;

	// scene graph

	this.sortObjects = true;

	// physically based shading

	this.gammaInput = false;
	this.gammaOutput = false;

	// shadow map

	this.shadowMapEnabled = false;
	this.shadowMapType = THREE.PCFShadowMap;
	this.shadowMapCullFace = THREE.CullFaceFront;
	this.shadowMapDebug = false;
	this.shadowMapCascade = false;

	// morphs

	this.maxMorphTargets = 8;
	this.maxMorphNormals = 4;

	// flags

	this.autoScaleCubemaps = true;

	// info

	this.info = {

		memory: {

			programs: 0,
			geometries: 0,
			textures: 0

		},

		render: {

			calls: 0,
			vertices: 0,
			faces: 0,
			points: 0

		}

	};

	// internal properties

	var _this = this,

	_programs = [],

	// internal state cache

	_currentProgram = null,
	_currentFramebuffer = null,
	_currentMaterialId = - 1,
	_currentGeometryGroupHash = - 1,
	_currentCamera = null,

	_usedTextureUnits = 0,

	// GL state cache

	_oldDoubleSided = - 1,
	_oldFlipSided = - 1,

	_oldBlending = - 1,

	_oldBlendEquation = - 1,
	_oldBlendSrc = - 1,
	_oldBlendDst = - 1,

	_oldDepthTest = - 1,
	_oldDepthWrite = - 1,

	_oldPolygonOffset = null,
	_oldPolygonOffsetFactor = null,
	_oldPolygonOffsetUnits = null,

	_oldLineWidth = null,

	_viewportX = 0,
	_viewportY = 0,
	_viewportWidth = _canvas.width,
	_viewportHeight = _canvas.height,
	_currentWidth = 0,
	_currentHeight = 0,

	_newAttributes = new Uint8Array( 16 ),
	_enabledAttributes = new Uint8Array( 16 ),

	// frustum

	_frustum = new THREE.Frustum(),

	 // camera matrices cache

	_projScreenMatrix = new THREE.Matrix4(),
	_projScreenMatrixPS = new THREE.Matrix4(),

	_vector3 = new THREE.Vector3(),

	// light arrays cache

	_direction = new THREE.Vector3(),

	_lightsNeedUpdate = true,

	_lights = {

		ambient: [ 0, 0, 0 ],
		directional: { length: 0, colors:[], positions: [] },
		point: { length: 0, colors: [], positions: [], distances: [] },
		spot: { length: 0, colors: [], positions: [], distances: [], directions: [], anglesCos: [], exponents: [] },
		hemi: { length: 0, skyColors: [], groundColors: [], positions: [] }

	};

	// initialize

	var _gl;

	try {

		var attributes = {
			alpha: _alpha,
			depth: _depth,
			stencil: _stencil,
			antialias: _antialias,
			premultipliedAlpha: _premultipliedAlpha,
			preserveDrawingBuffer: _preserveDrawingBuffer
		};

		_gl = _context || _canvas.getContext( 'webgl', attributes ) || _canvas.getContext( 'experimental-webgl', attributes );

		if ( _gl === null ) {

			if ( _canvas.getContext( 'webgl') !== null ) {

				throw 'Error creating WebGL context with your selected attributes.';

			} else {

				throw 'Error creating WebGL context.';

			}

		}

	} catch ( error ) {

		console.error( error );

	}

	if ( _gl.getShaderPrecisionFormat === undefined ) {

		_gl.getShaderPrecisionFormat = function () {

			return {
				'rangeMin': 1,
				'rangeMax': 1,
				'precision': 1
			};

		}

	}

	var extensions = new THREE.WebGLExtensions( _gl );

	extensions.get( 'OES_texture_float' );
	extensions.get( 'OES_texture_float_linear' );
	extensions.get( 'OES_standard_derivatives' );

	if ( _logarithmicDepthBuffer ) {

		extensions.get( 'EXT_frag_depth' );

	}

	//

	function setDefaultGLState() {

		_gl.clearColor( 0, 0, 0, 1 );
		_gl.clearDepth( 1 );
		_gl.clearStencil( 0 );

		_gl.enable( _gl.DEPTH_TEST );
		_gl.depthFunc( _gl.LEQUAL );

		_gl.frontFace( _gl.CCW );
		_gl.cullFace( _gl.BACK );
		_gl.enable( _gl.CULL_FACE );

		_gl.enable( _gl.BLEND );
		_gl.blendEquation( _gl.FUNC_ADD );
		_gl.blendFunc( _gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA );

		_gl.viewport( _viewportX, _viewportY, _viewportWidth, _viewportHeight );

		_gl.clearColor( _clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha );

	}

	setDefaultGLState();

	this.context = _gl;

	// GPU capabilities

	var _maxTextures = _gl.getParameter( _gl.MAX_TEXTURE_IMAGE_UNITS );
	var _maxVertexTextures = _gl.getParameter( _gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS );
	var _maxTextureSize = _gl.getParameter( _gl.MAX_TEXTURE_SIZE );
	var _maxCubemapSize = _gl.getParameter( _gl.MAX_CUBE_MAP_TEXTURE_SIZE );

	var _supportsVertexTextures = _maxVertexTextures > 0;
	var _supportsBoneTextures = _supportsVertexTextures && extensions.get( 'OES_texture_float' );

	//

	var _vertexShaderPrecisionHighpFloat = _gl.getShaderPrecisionFormat( _gl.VERTEX_SHADER, _gl.HIGH_FLOAT );
	var _vertexShaderPrecisionMediumpFloat = _gl.getShaderPrecisionFormat( _gl.VERTEX_SHADER, _gl.MEDIUM_FLOAT );
	var _vertexShaderPrecisionLowpFloat = _gl.getShaderPrecisionFormat( _gl.VERTEX_SHADER, _gl.LOW_FLOAT );

	var _fragmentShaderPrecisionHighpFloat = _gl.getShaderPrecisionFormat( _gl.FRAGMENT_SHADER, _gl.HIGH_FLOAT );
	var _fragmentShaderPrecisionMediumpFloat = _gl.getShaderPrecisionFormat( _gl.FRAGMENT_SHADER, _gl.MEDIUM_FLOAT );
	var _fragmentShaderPrecisionLowpFloat = _gl.getShaderPrecisionFormat( _gl.FRAGMENT_SHADER, _gl.LOW_FLOAT );

	var getCompressedTextureFormats = ( function () {

		var array;

		return function () {

			if ( array !== undefined ) {

				return array;

			}

			array = [];

			if ( extensions.get( 'WEBGL_compressed_texture_pvrtc' ) || extensions.get( 'WEBGL_compressed_texture_s3tc' ) ) {

				var formats = _gl.getParameter( _gl.COMPRESSED_TEXTURE_FORMATS );

				for ( var i = 0; i < formats.length; i ++ ){

					array.push( formats[ i ] );

				}

			}
			
			return array;

		};

	} )();

	// clamp precision to maximum available

	var highpAvailable = _vertexShaderPrecisionHighpFloat.precision > 0 && _fragmentShaderPrecisionHighpFloat.precision > 0;
	var mediumpAvailable = _vertexShaderPrecisionMediumpFloat.precision > 0 && _fragmentShaderPrecisionMediumpFloat.precision > 0;

	if ( _precision === 'highp' && ! highpAvailable ) {

		if ( mediumpAvailable ) {

			_precision = 'mediump';
			console.warn( 'THREE.WebGLRenderer: highp not supported, using mediump.' );

		} else {

			_precision = 'lowp';
			console.warn( 'THREE.WebGLRenderer: highp and mediump not supported, using lowp.' );

		}

	}

	if ( _precision === 'mediump' && ! mediumpAvailable ) {

		_precision = 'lowp';
		console.warn( 'THREE.WebGLRenderer: mediump not supported, using lowp.' );

	}

	// Plugins

	var shadowMapPlugin = new THREE.ShadowMapPlugin( this, lights, _webglObjects, _webglObjectsImmediate );

	var spritePlugin = new THREE.SpritePlugin( this, sprites );
	var lensFlarePlugin = new THREE.LensFlarePlugin( this, lensFlares );

	// API

	this.getContext = function () {

		return _gl;

	};

	this.supportsVertexTextures = function () {

		return _supportsVertexTextures;

	};

	this.supportsFloatTextures = function () {

		return extensions.get( 'OES_texture_float' );

	};

	this.supportsStandardDerivatives = function () {

		return extensions.get( 'OES_standard_derivatives' );

	};

	this.supportsCompressedTextureS3TC = function () {

		return extensions.get( 'WEBGL_compressed_texture_s3tc' );

	};

	this.supportsCompressedTexturePVRTC = function () {

		return extensions.get( 'WEBGL_compressed_texture_pvrtc' );

	};

	this.supportsBlendMinMax = function () {

		return extensions.get( 'EXT_blend_minmax' );

	};

	this.getMaxAnisotropy = ( function () {

		var value;

		return function () {

			if ( value !== undefined ) {

				return value;

			}

			var extension = extensions.get( 'EXT_texture_filter_anisotropic' );

			value = extension !== null ? _gl.getParameter( extension.MAX_TEXTURE_MAX_ANISOTROPY_EXT ) : 0;

			return value;

		}

	} )();

	this.getPrecision = function () {

		return _precision;

	};

	this.setSize = function ( width, height, updateStyle ) {

		_canvas.width = width * this.devicePixelRatio;
		_canvas.height = height * this.devicePixelRatio;

		if ( updateStyle !== false ) {

			_canvas.style.width = width + 'px';
			_canvas.style.height = height + 'px';

		}

		this.setViewport( 0, 0, width, height );

	};

	this.setViewport = function ( x, y, width, height ) {

		_viewportX = x * this.devicePixelRatio;
		_viewportY = y * this.devicePixelRatio;

		_viewportWidth = width * this.devicePixelRatio;
		_viewportHeight = height * this.devicePixelRatio;

		_gl.viewport( _viewportX, _viewportY, _viewportWidth, _viewportHeight );

	};

	this.setScissor = function ( x, y, width, height ) {

		_gl.scissor(
			x * this.devicePixelRatio,
			y * this.devicePixelRatio,
			width * this.devicePixelRatio,
			height * this.devicePixelRatio
		);

	};

	this.enableScissorTest = function ( enable ) {

		enable ? _gl.enable( _gl.SCISSOR_TEST ) : _gl.disable( _gl.SCISSOR_TEST );

	};

	// Clearing

	this.setClearColor = function ( color, alpha ) {

		_clearColor.set( color );
		_clearAlpha = alpha !== undefined ? alpha : 1;

		_gl.clearColor( _clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha );

	};

	this.setClearColorHex = function ( hex, alpha ) {

		console.warn( 'THREE.WebGLRenderer: .setClearColorHex() is being removed. Use .setClearColor() instead.' );
		this.setClearColor( hex, alpha );

	};

	this.getClearColor = function () {

		return _clearColor;

	};

	this.getClearAlpha = function () {

		return _clearAlpha;

	};

	this.clear = function ( color, depth, stencil ) {

		var bits = 0;

		if ( color === undefined || color ) bits |= _gl.COLOR_BUFFER_BIT;
		if ( depth === undefined || depth ) bits |= _gl.DEPTH_BUFFER_BIT;
		if ( stencil === undefined || stencil ) bits |= _gl.STENCIL_BUFFER_BIT;

		_gl.clear( bits );

	};

	this.clearColor = function () {

		_gl.clear( _gl.COLOR_BUFFER_BIT );

	};

	this.clearDepth = function () {

		_gl.clear( _gl.DEPTH_BUFFER_BIT );

	};

	this.clearStencil = function () {

		_gl.clear( _gl.STENCIL_BUFFER_BIT );

	};

	this.clearTarget = function ( renderTarget, color, depth, stencil ) {

		this.setRenderTarget( renderTarget );
		this.clear( color, depth, stencil );

	};

	// Reset

	this.resetGLState = function () {

		_currentProgram = null;
		_currentCamera = null;

		_oldBlending = - 1;
		_oldDepthTest = - 1;
		_oldDepthWrite = - 1;
		_oldDoubleSided = - 1;
		_oldFlipSided = - 1;
		_currentGeometryGroupHash = - 1;
		_currentMaterialId = - 1;

		_lightsNeedUpdate = true;

	};

	// Buffer allocation

	function createParticleBuffers ( geometry ) {

		geometry.__webglVertexBuffer = _gl.createBuffer();
		geometry.__webglColorBuffer = _gl.createBuffer();

		_this.info.memory.geometries ++;

	};

	function createLineBuffers ( geometry ) {

		geometry.__webglVertexBuffer = _gl.createBuffer();
		geometry.__webglColorBuffer = _gl.createBuffer();
		geometry.__webglLineDistanceBuffer = _gl.createBuffer();

		_this.info.memory.geometries ++;

	};

	function createMeshBuffers ( geometryGroup ) {

		geometryGroup.__webglVertexBuffer = _gl.createBuffer();
		geometryGroup.__webglNormalBuffer = _gl.createBuffer();
		geometryGroup.__webglTangentBuffer = _gl.createBuffer();
		geometryGroup.__webglColorBuffer = _gl.createBuffer();
		geometryGroup.__webglUVBuffer = _gl.createBuffer();
		geometryGroup.__webglUV2Buffer = _gl.createBuffer();

		geometryGroup.__webglSkinIndicesBuffer = _gl.createBuffer();
		geometryGroup.__webglSkinWeightsBuffer = _gl.createBuffer();

		geometryGroup.__webglFaceBuffer = _gl.createBuffer();
		geometryGroup.__webglLineBuffer = _gl.createBuffer();

		var m, ml;

		if ( geometryGroup.numMorphTargets ) {

			geometryGroup.__webglMorphTargetsBuffers = [];

			for ( m = 0, ml = geometryGroup.numMorphTargets; m < ml; m ++ ) {

				geometryGroup.__webglMorphTargetsBuffers.push( _gl.createBuffer() );

			}

		}

		if ( geometryGroup.numMorphNormals ) {

			geometryGroup.__webglMorphNormalsBuffers = [];

			for ( m = 0, ml = geometryGroup.numMorphNormals; m < ml; m ++ ) {

				geometryGroup.__webglMorphNormalsBuffers.push( _gl.createBuffer() );

			}

		}

		_this.info.memory.geometries ++;

	};

	// Events

	var onObjectRemoved = function ( event ) {

		var object = event.target;

		object.traverse( function ( child ) {

			child.removeEventListener( 'remove', onObjectRemoved );

			removeObject( child );

		} );

	};

	var onGeometryDispose = function ( event ) {

		var geometry = event.target;

		geometry.removeEventListener( 'dispose', onGeometryDispose );

		deallocateGeometry( geometry );

	};

	var onTextureDispose = function ( event ) {

		var texture = event.target;

		texture.removeEventListener( 'dispose', onTextureDispose );

		deallocateTexture( texture );

		_this.info.memory.textures --;


	};

	var onRenderTargetDispose = function ( event ) {

		var renderTarget = event.target;

		renderTarget.removeEventListener( 'dispose', onRenderTargetDispose );

		deallocateRenderTarget( renderTarget );

		_this.info.memory.textures --;

	};

	var onMaterialDispose = function ( event ) {

		var material = event.target;

		material.removeEventListener( 'dispose', onMaterialDispose );

		deallocateMaterial( material );

	};

	// Buffer deallocation

	var deleteBuffers = function ( geometry ) {
	
		var buffers = [
			'__webglVertexBuffer',
			'__webglNormalBuffer',
			'__webglTangentBuffer',
			'__webglColorBuffer',
			'__webglUVBuffer',
			'__webglUV2Buffer',
			
			'__webglSkinIndicesBuffer',
			'__webglSkinWeightsBuffer',
			
			'__webglFaceBuffer',
			'__webglLineBuffer',
			
			'__webglLineDistanceBuffer'
		];

		for ( var i = 0, l = buffers.length; i < l; i ++ ) {

			var name = buffers[ i ];

			if ( geometry[ name ] !== undefined ) {

				_gl.deleteBuffer( geometry[ name ] );

				delete geometry[ name ];

			}

		}

		// custom attributes

		if ( geometry.__webglCustomAttributesList !== undefined ) {

			for ( var name in geometry.__webglCustomAttributesList ) {

				_gl.deleteBuffer( geometry.__webglCustomAttributesList[ name ].buffer );

			}

			delete geometry.__webglCustomAttributesList;

		}

		_this.info.memory.geometries --;

	};

	var deallocateGeometry = function ( geometry ) {

		delete geometry.__webglInit;

		if ( geometry instanceof THREE.BufferGeometry ) {

			for ( var name in geometry.attributes ) {
			
				var attribute = geometry.attributes[ name ];

				if ( attribute.buffer !== undefined ) {

					_gl.deleteBuffer( attribute.buffer );

					delete attribute.buffer;

				}

			}

			_this.info.memory.geometries --;

		} else {

			var geometryGroupsList = geometryGroups[ geometry.id ];

			if ( geometryGroupsList !== undefined ) {

				for ( var i = 0,l = geometryGroupsList.length; i < l; i ++ ) {

					var geometryGroup = geometryGroupsList[ i ];

					if ( geometryGroup.numMorphTargets !== undefined ) {

						for ( var m = 0, ml = geometryGroup.numMorphTargets; m < ml; m ++ ) {

							_gl.deleteBuffer( geometryGroup.__webglMorphTargetsBuffers[ m ] );

						}

						delete geometryGroup.__webglMorphTargetsBuffers;

					}

					if ( geometryGroup.numMorphNormals !== undefined ) {

						for ( var m = 0, ml = geometryGroup.numMorphNormals; m < ml; m ++ ) {

							_gl.deleteBuffer( geometryGroup.__webglMorphNormalsBuffers[ m ] );

						}

						delete geometryGroup.__webglMorphNormalsBuffers;

					}

					deleteBuffers( geometryGroup );

				}

				delete geometryGroups[ geometry.id ];

			} else {

				deleteBuffers( geometry );

			}

		}

		// TOFIX: Workaround for deleted geometry being currently bound

		_currentGeometryGroupHash = - 1;

	};

	var deallocateTexture = function ( texture ) {

		if ( texture.image && texture.image.__webglTextureCube ) {

			// cube texture

			_gl.deleteTexture( texture.image.__webglTextureCube );

			delete texture.image.__webglTextureCube;

		} else {

			// 2D texture

			if ( texture.__webglInit === undefined ) return;

			_gl.deleteTexture( texture.__webglTexture );

			delete texture.__webglTexture;
			delete texture.__webglInit;

		}

	};

	var deallocateRenderTarget = function ( renderTarget ) {

		if ( ! renderTarget || renderTarget.__webglTexture === undefined ) return;

		_gl.deleteTexture( renderTarget.__webglTexture );

		delete renderTarget.__webglTexture;

		if ( renderTarget instanceof THREE.WebGLRenderTargetCube ) {

			for ( var i = 0; i < 6; i ++ ) {

				_gl.deleteFramebuffer( renderTarget.__webglFramebuffer[ i ] );
				_gl.deleteRenderbuffer( renderTarget.__webglRenderbuffer[ i ] );

			}

		} else {

			_gl.deleteFramebuffer( renderTarget.__webglFramebuffer );
			_gl.deleteRenderbuffer( renderTarget.__webglRenderbuffer );

		}

		delete renderTarget.__webglFramebuffer;
		delete renderTarget.__webglRenderbuffer;

	};

	var deallocateMaterial = function ( material ) {

		var program = material.program.program;

		if ( program === undefined ) return;

		material.program = undefined;

		// only deallocate GL program if this was the last use of shared program
		// assumed there is only single copy of any program in the _programs list
		// (that's how it's constructed)

		var i, il, programInfo;
		var deleteProgram = false;

		for ( i = 0, il = _programs.length; i < il; i ++ ) {

			programInfo = _programs[ i ];

			if ( programInfo.program === program ) {

				programInfo.usedTimes --;

				if ( programInfo.usedTimes === 0 ) {

					deleteProgram = true;

				}

				break;

			}

		}

		if ( deleteProgram === true ) {

			// avoid using array.splice, this is costlier than creating new array from scratch

			var newPrograms = [];

			for ( i = 0, il = _programs.length; i < il; i ++ ) {

				programInfo = _programs[ i ];

				if ( programInfo.program !== program ) {

					newPrograms.push( programInfo );

				}

			}

			_programs = newPrograms;

			_gl.deleteProgram( program );

			_this.info.memory.programs --;

		}

	};

	// Buffer initialization

	function initCustomAttributes ( object ) {

		var geometry = object.geometry;
		var material = object.material;

		var nvertices = geometry.vertices.length;

		if ( material.attributes ) {

			if ( geometry.__webglCustomAttributesList === undefined ) {

				geometry.__webglCustomAttributesList = [];

			}

			for ( var name in material.attributes ) {

				var attribute = material.attributes[ name ];

				if ( ! attribute.__webglInitialized || attribute.createUniqueBuffers ) {

					attribute.__webglInitialized = true;

					var size = 1;   // "f" and "i"

					if ( attribute.type === 'v2' ) size = 2;
					else if ( attribute.type === 'v3' ) size = 3;
					else if ( attribute.type === 'v4' ) size = 4;
					else if ( attribute.type === 'c'  ) size = 3;

					attribute.size = size;

					attribute.array = new Float32Array( nvertices * size );

					attribute.buffer = _gl.createBuffer();
					attribute.buffer.belongsToAttribute = name;

					attribute.needsUpdate = true;

				}

				geometry.__webglCustomAttributesList.push( attribute );

			}

		}

	};

	function initParticleBuffers ( geometry, object ) {

		var nvertices = geometry.vertices.length;

		geometry.__vertexArray = new Float32Array( nvertices * 3 );
		geometry.__colorArray = new Float32Array( nvertices * 3 );

		geometry.__sortArray = [];

		geometry.__webglParticleCount = nvertices;

		initCustomAttributes( object );

	};

	function initLineBuffers ( geometry, object ) {

		var nvertices = geometry.vertices.length;

		geometry.__vertexArray = new Float32Array( nvertices * 3 );
		geometry.__colorArray = new Float32Array( nvertices * 3 );
		geometry.__lineDistanceArray = new Float32Array( nvertices * 1 );

		geometry.__webglLineCount = nvertices;

		initCustomAttributes( object );

	};

	function initMeshBuffers ( geometryGroup, object ) {

		var geometry = object.geometry,
			faces3 = geometryGroup.faces3,

			nvertices = faces3.length * 3,
			ntris     = faces3.length * 1,
			nlines    = faces3.length * 3,

			material = getBufferMaterial( object, geometryGroup );

		geometryGroup.__vertexArray = new Float32Array( nvertices * 3 );
		geometryGroup.__normalArray = new Float32Array( nvertices * 3 );
		geometryGroup.__colorArray = new Float32Array( nvertices * 3 );
		geometryGroup.__uvArray = new Float32Array( nvertices * 2 );

		if ( geometry.faceVertexUvs.length > 1 ) {

			geometryGroup.__uv2Array = new Float32Array( nvertices * 2 );

		}

		if ( geometry.hasTangents ) {

			geometryGroup.__tangentArray = new Float32Array( nvertices * 4 );

		}

		if ( object.geometry.skinWeights.length && object.geometry.skinIndices.length ) {

			geometryGroup.__skinIndexArray = new Float32Array( nvertices * 4 );
			geometryGroup.__skinWeightArray = new Float32Array( nvertices * 4 );

		}

		var UintArray = extensions.get( 'OES_element_index_uint' ) !== null && ntris > 21845 ? Uint32Array : Uint16Array; // 65535 / 3

		geometryGroup.__typeArray = UintArray;
		geometryGroup.__faceArray = new UintArray( ntris * 3 );
		geometryGroup.__lineArray = new UintArray( nlines * 2 );

		var m, ml;

		if ( geometryGroup.numMorphTargets ) {

			geometryGroup.__morphTargetsArrays = [];

			for ( m = 0, ml = geometryGroup.numMorphTargets; m < ml; m ++ ) {

				geometryGroup.__morphTargetsArrays.push( new Float32Array( nvertices * 3 ) );

			}

		}

		if ( geometryGroup.numMorphNormals ) {

			geometryGroup.__morphNormalsArrays = [];

			for ( m = 0, ml = geometryGroup.numMorphNormals; m < ml; m ++ ) {

				geometryGroup.__morphNormalsArrays.push( new Float32Array( nvertices * 3 ) );

			}

		}

		geometryGroup.__webglFaceCount = ntris * 3;
		geometryGroup.__webglLineCount = nlines * 2;


		// custom attributes

		if ( material.attributes ) {

			if ( geometryGroup.__webglCustomAttributesList === undefined ) {

				geometryGroup.__webglCustomAttributesList = [];

			}

			for ( var name in material.attributes ) {

				// Do a shallow copy of the attribute object so different geometryGroup chunks use different
				// attribute buffers which are correctly indexed in the setMeshBuffers function

				var originalAttribute = material.attributes[ name ];

				var attribute = {};

				for ( var property in originalAttribute ) {

					attribute[ property ] = originalAttribute[ property ];

				}

				if ( ! attribute.__webglInitialized || attribute.createUniqueBuffers ) {

					attribute.__webglInitialized = true;

					var size = 1;   // "f" and "i"

					if ( attribute.type === 'v2' ) size = 2;
					else if ( attribute.type === 'v3' ) size = 3;
					else if ( attribute.type === 'v4' ) size = 4;
					else if ( attribute.type === 'c'  ) size = 3;

					attribute.size = size;

					attribute.array = new Float32Array( nvertices * size );

					attribute.buffer = _gl.createBuffer();
					attribute.buffer.belongsToAttribute = name;

					originalAttribute.needsUpdate = true;
					attribute.__original = originalAttribute;

				}

				geometryGroup.__webglCustomAttributesList.push( attribute );

			}

		}

		geometryGroup.__inittedArrays = true;

	};

	function getBufferMaterial( object, geometryGroup ) {

		return object.material instanceof THREE.MeshFaceMaterial
			 ? object.material.materials[ geometryGroup.materialIndex ]
			 : object.material;

	};

	function materialNeedsSmoothNormals ( material ) {

		return material && material.shading !== undefined && material.shading === THREE.SmoothShading;

	};

	// Buffer setting

	function setParticleBuffers ( geometry, hint, object ) {

		var v, c, vertex, offset, index, color,

		vertices = geometry.vertices,
		vl = vertices.length,

		colors = geometry.colors,
		cl = colors.length,

		vertexArray = geometry.__vertexArray,
		colorArray = geometry.__colorArray,

		sortArray = geometry.__sortArray,

		dirtyVertices = geometry.verticesNeedUpdate,
		dirtyElements = geometry.elementsNeedUpdate,
		dirtyColors = geometry.colorsNeedUpdate,

		customAttributes = geometry.__webglCustomAttributesList,
		i, il,
		a, ca, cal, value,
		customAttribute;

		if ( object.sortParticles ) {

			_projScreenMatrixPS.copy( _projScreenMatrix );
			_projScreenMatrixPS.multiply( object.matrixWorld );

			for ( v = 0; v < vl; v ++ ) {

				vertex = vertices[ v ];

				_vector3.copy( vertex );
				_vector3.applyProjection( _projScreenMatrixPS );

				sortArray[ v ] = [ _vector3.z, v ];

			}

			sortArray.sort( numericalSort );

			for ( v = 0; v < vl; v ++ ) {

				vertex = vertices[ sortArray[ v ][ 1 ] ];

				offset = v * 3;

				vertexArray[ offset ]     = vertex.x;
				vertexArray[ offset + 1 ] = vertex.y;
				vertexArray[ offset + 2 ] = vertex.z;

			}

			for ( c = 0; c < cl; c ++ ) {

				offset = c * 3;

				color = colors[ sortArray[ c ][ 1 ] ];

				colorArray[ offset ]     = color.r;
				colorArray[ offset + 1 ] = color.g;
				colorArray[ offset + 2 ] = color.b;

			}

			if ( customAttributes ) {

				for ( i = 0, il = customAttributes.length; i < il; i ++ ) {

					customAttribute = customAttributes[ i ];

					if ( ! ( customAttribute.boundTo === undefined || customAttribute.boundTo === 'vertices' ) ) continue;

					offset = 0;

					cal = customAttribute.value.length;

					if ( customAttribute.size === 1 ) {

						for ( ca = 0; ca < cal; ca ++ ) {

							index = sortArray[ ca ][ 1 ];

							customAttribute.array[ ca ] = customAttribute.value[ index ];

						}

					} else if ( customAttribute.size === 2 ) {

						for ( ca = 0; ca < cal; ca ++ ) {

							index = sortArray[ ca ][ 1 ];

							value = customAttribute.value[ index ];

							customAttribute.array[ offset ]   = value.x;
							customAttribute.array[ offset + 1 ] = value.y;

							offset += 2;

						}

					} else if ( customAttribute.size === 3 ) {

						if ( customAttribute.type === 'c' ) {

							for ( ca = 0; ca < cal; ca ++ ) {

								index = sortArray[ ca ][ 1 ];

								value = customAttribute.value[ index ];

								customAttribute.array[ offset ]     = value.r;
								customAttribute.array[ offset + 1 ] = value.g;
								customAttribute.array[ offset + 2 ] = value.b;

								offset += 3;

							}

						} else {

							for ( ca = 0; ca < cal; ca ++ ) {

								index = sortArray[ ca ][ 1 ];

								value = customAttribute.value[ index ];

								customAttribute.array[ offset ]   = value.x;
								customAttribute.array[ offset + 1 ] = value.y;
								customAttribute.array[ offset + 2 ] = value.z;

								offset += 3;

							}

						}

					} else if ( customAttribute.size === 4 ) {

						for ( ca = 0; ca < cal; ca ++ ) {

							index = sortArray[ ca ][ 1 ];

							value = customAttribute.value[ index ];

							customAttribute.array[ offset ]      = value.x;
							customAttribute.array[ offset + 1  ] = value.y;
							customAttribute.array[ offset + 2  ] = value.z;
							customAttribute.array[ offset + 3  ] = value.w;

							offset += 4;

						}

					}

				}

			}

		} else {

			if ( dirtyVertices ) {

				for ( v = 0; v < vl; v ++ ) {

					vertex = vertices[ v ];

					offset = v * 3;

					vertexArray[ offset ]     = vertex.x;
					vertexArray[ offset + 1 ] = vertex.y;
					vertexArray[ offset + 2 ] = vertex.z;

				}

			}

			if ( dirtyColors ) {

				for ( c = 0; c < cl; c ++ ) {

					color = colors[ c ];

					offset = c * 3;

					colorArray[ offset ]     = color.r;
					colorArray[ offset + 1 ] = color.g;
					colorArray[ offset + 2 ] = color.b;

				}

			}

			if ( customAttributes ) {

				for ( i = 0, il = customAttributes.length; i < il; i ++ ) {

					customAttribute = customAttributes[ i ];

					if ( customAttribute.needsUpdate &&
						 ( customAttribute.boundTo === undefined ||
							 customAttribute.boundTo === 'vertices' ) ) {

						cal = customAttribute.value.length;

						offset = 0;

						if ( customAttribute.size === 1 ) {

							for ( ca = 0; ca < cal; ca ++ ) {

								customAttribute.array[ ca ] = customAttribute.value[ ca ];

							}

						} else if ( customAttribute.size === 2 ) {

							for ( ca = 0; ca < cal; ca ++ ) {

								value = customAttribute.value[ ca ];

								customAttribute.array[ offset ]   = value.x;
								customAttribute.array[ offset + 1 ] = value.y;

								offset += 2;

							}

						} else if ( customAttribute.size === 3 ) {

							if ( customAttribute.type === 'c' ) {

								for ( ca = 0; ca < cal; ca ++ ) {

									value = customAttribute.value[ ca ];

									customAttribute.array[ offset ]   = value.r;
									customAttribute.array[ offset + 1 ] = value.g;
									customAttribute.array[ offset + 2 ] = value.b;

									offset += 3;

								}

							} else {

								for ( ca = 0; ca < cal; ca ++ ) {

									value = customAttribute.value[ ca ];

									customAttribute.array[ offset ]   = value.x;
									customAttribute.array[ offset + 1 ] = value.y;
									customAttribute.array[ offset + 2 ] = value.z;

									offset += 3;

								}

							}

						} else if ( customAttribute.size === 4 ) {

							for ( ca = 0; ca < cal; ca ++ ) {

								value = customAttribute.value[ ca ];

								customAttribute.array[ offset ]      = value.x;
								customAttribute.array[ offset + 1  ] = value.y;
								customAttribute.array[ offset + 2  ] = value.z;
								customAttribute.array[ offset + 3  ] = value.w;

								offset += 4;

							}

						}

					}

				}

			}

		}

		if ( dirtyVertices || object.sortParticles ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.__webglVertexBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, vertexArray, hint );

		}

		if ( dirtyColors || object.sortParticles ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.__webglColorBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, colorArray, hint );

		}

		if ( customAttributes ) {

			for ( i = 0, il = customAttributes.length; i < il; i ++ ) {

				customAttribute = customAttributes[ i ];

				if ( customAttribute.needsUpdate || object.sortParticles ) {

					_gl.bindBuffer( _gl.ARRAY_BUFFER, customAttribute.buffer );
					_gl.bufferData( _gl.ARRAY_BUFFER, customAttribute.array, hint );

				}

			}

		}

	}

	function setLineBuffers ( geometry, hint ) {

		var v, c, d, vertex, offset, color,

		vertices = geometry.vertices,
		colors = geometry.colors,
		lineDistances = geometry.lineDistances,

		vl = vertices.length,
		cl = colors.length,
		dl = lineDistances.length,

		vertexArray = geometry.__vertexArray,
		colorArray = geometry.__colorArray,
		lineDistanceArray = geometry.__lineDistanceArray,

		dirtyVertices = geometry.verticesNeedUpdate,
		dirtyColors = geometry.colorsNeedUpdate,
		dirtyLineDistances = geometry.lineDistancesNeedUpdate,

		customAttributes = geometry.__webglCustomAttributesList,

		i, il,
		a, ca, cal, value,
		customAttribute;

		if ( dirtyVertices ) {

			for ( v = 0; v < vl; v ++ ) {

				vertex = vertices[ v ];

				offset = v * 3;

				vertexArray[ offset ]     = vertex.x;
				vertexArray[ offset + 1 ] = vertex.y;
				vertexArray[ offset + 2 ] = vertex.z;

			}

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.__webglVertexBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, vertexArray, hint );

		}

		if ( dirtyColors ) {

			for ( c = 0; c < cl; c ++ ) {

				color = colors[ c ];

				offset = c * 3;

				colorArray[ offset ]     = color.r;
				colorArray[ offset + 1 ] = color.g;
				colorArray[ offset + 2 ] = color.b;

			}

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.__webglColorBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, colorArray, hint );

		}

		if ( dirtyLineDistances ) {

			for ( d = 0; d < dl; d ++ ) {

				lineDistanceArray[ d ] = lineDistances[ d ];

			}

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.__webglLineDistanceBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, lineDistanceArray, hint );

		}

		if ( customAttributes ) {

			for ( i = 0, il = customAttributes.length; i < il; i ++ ) {

				customAttribute = customAttributes[ i ];

				if ( customAttribute.needsUpdate &&
					 ( customAttribute.boundTo === undefined ||
						 customAttribute.boundTo === 'vertices' ) ) {

					offset = 0;

					cal = customAttribute.value.length;

					if ( customAttribute.size === 1 ) {

						for ( ca = 0; ca < cal; ca ++ ) {

							customAttribute.array[ ca ] = customAttribute.value[ ca ];

						}

					} else if ( customAttribute.size === 2 ) {

						for ( ca = 0; ca < cal; ca ++ ) {

							value = customAttribute.value[ ca ];

							customAttribute.array[ offset ]   = value.x;
							customAttribute.array[ offset + 1 ] = value.y;

							offset += 2;

						}

					} else if ( customAttribute.size === 3 ) {

						if ( customAttribute.type === 'c' ) {

							for ( ca = 0; ca < cal; ca ++ ) {

								value = customAttribute.value[ ca ];

								customAttribute.array[ offset ]   = value.r;
								customAttribute.array[ offset + 1 ] = value.g;
								customAttribute.array[ offset + 2 ] = value.b;

								offset += 3;

							}

						} else {

							for ( ca = 0; ca < cal; ca ++ ) {

								value = customAttribute.value[ ca ];

								customAttribute.array[ offset ]   = value.x;
								customAttribute.array[ offset + 1 ] = value.y;
								customAttribute.array[ offset + 2 ] = value.z;

								offset += 3;

							}

						}

					} else if ( customAttribute.size === 4 ) {

						for ( ca = 0; ca < cal; ca ++ ) {

							value = customAttribute.value[ ca ];

							customAttribute.array[ offset ]    = value.x;
							customAttribute.array[ offset + 1  ] = value.y;
							customAttribute.array[ offset + 2  ] = value.z;
							customAttribute.array[ offset + 3  ] = value.w;

							offset += 4;

						}

					}

					_gl.bindBuffer( _gl.ARRAY_BUFFER, customAttribute.buffer );
					_gl.bufferData( _gl.ARRAY_BUFFER, customAttribute.array, hint );

				}

			}

		}

	}

	function setMeshBuffers( geometryGroup, object, hint, dispose, material ) {

		if ( ! geometryGroup.__inittedArrays ) {

			return;

		}

		var needsSmoothNormals = materialNeedsSmoothNormals( material );

		var f, fl, fi, face,
		vertexNormals, faceNormal, normal,
		vertexColors, faceColor,
		vertexTangents,
		uv, uv2, v1, v2, v3, v4, t1, t2, t3, t4, n1, n2, n3, n4,
		c1, c2, c3,
		sw1, sw2, sw3, sw4,
		si1, si2, si3, si4,
		sa1, sa2, sa3, sa4,
		sb1, sb2, sb3, sb4,
		m, ml, i, il,
		vn, uvi, uv2i,
		vk, vkl, vka,
		nka, chf, faceVertexNormals,
		a,

		vertexIndex = 0,

		offset = 0,
		offset_uv = 0,
		offset_uv2 = 0,
		offset_face = 0,
		offset_normal = 0,
		offset_tangent = 0,
		offset_line = 0,
		offset_color = 0,
		offset_skin = 0,
		offset_morphTarget = 0,
		offset_custom = 0,
		offset_customSrc = 0,

		value,

		vertexArray = geometryGroup.__vertexArray,
		uvArray = geometryGroup.__uvArray,
		uv2Array = geometryGroup.__uv2Array,
		normalArray = geometryGroup.__normalArray,
		tangentArray = geometryGroup.__tangentArray,
		colorArray = geometryGroup.__colorArray,

		skinIndexArray = geometryGroup.__skinIndexArray,
		skinWeightArray = geometryGroup.__skinWeightArray,

		morphTargetsArrays = geometryGroup.__morphTargetsArrays,
		morphNormalsArrays = geometryGroup.__morphNormalsArrays,

		customAttributes = geometryGroup.__webglCustomAttributesList,
		customAttribute,

		faceArray = geometryGroup.__faceArray,
		lineArray = geometryGroup.__lineArray,

		geometry = object.geometry, // this is shared for all chunks

		dirtyVertices = geometry.verticesNeedUpdate,
		dirtyElements = geometry.elementsNeedUpdate,
		dirtyUvs = geometry.uvsNeedUpdate,
		dirtyNormals = geometry.normalsNeedUpdate,
		dirtyTangents = geometry.tangentsNeedUpdate,
		dirtyColors = geometry.colorsNeedUpdate,
		dirtyMorphTargets = geometry.morphTargetsNeedUpdate,

		vertices = geometry.vertices,
		chunk_faces3 = geometryGroup.faces3,
		obj_faces = geometry.faces,

		obj_uvs  = geometry.faceVertexUvs[ 0 ],
		obj_uvs2 = geometry.faceVertexUvs[ 1 ],

		obj_colors = geometry.colors,

		obj_skinIndices = geometry.skinIndices,
		obj_skinWeights = geometry.skinWeights,

		morphTargets = geometry.morphTargets,
		morphNormals = geometry.morphNormals;

		if ( dirtyVertices ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				face = obj_faces[ chunk_faces3[ f ] ];

				v1 = vertices[ face.a ];
				v2 = vertices[ face.b ];
				v3 = vertices[ face.c ];

				vertexArray[ offset ]     = v1.x;
				vertexArray[ offset + 1 ] = v1.y;
				vertexArray[ offset + 2 ] = v1.z;

				vertexArray[ offset + 3 ] = v2.x;
				vertexArray[ offset + 4 ] = v2.y;
				vertexArray[ offset + 5 ] = v2.z;

				vertexArray[ offset + 6 ] = v3.x;
				vertexArray[ offset + 7 ] = v3.y;
				vertexArray[ offset + 8 ] = v3.z;

				offset += 9;

			}

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglVertexBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, vertexArray, hint );

		}

		if ( dirtyMorphTargets ) {

			for ( vk = 0, vkl = morphTargets.length; vk < vkl; vk ++ ) {

				offset_morphTarget = 0;

				for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

					chf = chunk_faces3[ f ];
					face = obj_faces[ chf ];

					// morph positions

					v1 = morphTargets[ vk ].vertices[ face.a ];
					v2 = morphTargets[ vk ].vertices[ face.b ];
					v3 = morphTargets[ vk ].vertices[ face.c ];

					vka = morphTargetsArrays[ vk ];

					vka[ offset_morphTarget ]     = v1.x;
					vka[ offset_morphTarget + 1 ] = v1.y;
					vka[ offset_morphTarget + 2 ] = v1.z;

					vka[ offset_morphTarget + 3 ] = v2.x;
					vka[ offset_morphTarget + 4 ] = v2.y;
					vka[ offset_morphTarget + 5 ] = v2.z;

					vka[ offset_morphTarget + 6 ] = v3.x;
					vka[ offset_morphTarget + 7 ] = v3.y;
					vka[ offset_morphTarget + 8 ] = v3.z;

					// morph normals

					if ( material.morphNormals ) {

						if ( needsSmoothNormals ) {

							faceVertexNormals = morphNormals[ vk ].vertexNormals[ chf ];

							n1 = faceVertexNormals.a;
							n2 = faceVertexNormals.b;
							n3 = faceVertexNormals.c;

						} else {

							n1 = morphNormals[ vk ].faceNormals[ chf ];
							n2 = n1;
							n3 = n1;

						}

						nka = morphNormalsArrays[ vk ];

						nka[ offset_morphTarget ]     = n1.x;
						nka[ offset_morphTarget + 1 ] = n1.y;
						nka[ offset_morphTarget + 2 ] = n1.z;

						nka[ offset_morphTarget + 3 ] = n2.x;
						nka[ offset_morphTarget + 4 ] = n2.y;
						nka[ offset_morphTarget + 5 ] = n2.z;

						nka[ offset_morphTarget + 6 ] = n3.x;
						nka[ offset_morphTarget + 7 ] = n3.y;
						nka[ offset_morphTarget + 8 ] = n3.z;

					}

					//

					offset_morphTarget += 9;

				}

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglMorphTargetsBuffers[ vk ] );
				_gl.bufferData( _gl.ARRAY_BUFFER, morphTargetsArrays[ vk ], hint );

				if ( material.morphNormals ) {

					_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglMorphNormalsBuffers[ vk ] );
					_gl.bufferData( _gl.ARRAY_BUFFER, morphNormalsArrays[ vk ], hint );

				}

			}

		}

		if ( obj_skinWeights.length ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				face = obj_faces[ chunk_faces3[ f ] ];

				// weights

				sw1 = obj_skinWeights[ face.a ];
				sw2 = obj_skinWeights[ face.b ];
				sw3 = obj_skinWeights[ face.c ];

				skinWeightArray[ offset_skin ]     = sw1.x;
				skinWeightArray[ offset_skin + 1 ] = sw1.y;
				skinWeightArray[ offset_skin + 2 ] = sw1.z;
				skinWeightArray[ offset_skin + 3 ] = sw1.w;

				skinWeightArray[ offset_skin + 4 ] = sw2.x;
				skinWeightArray[ offset_skin + 5 ] = sw2.y;
				skinWeightArray[ offset_skin + 6 ] = sw2.z;
				skinWeightArray[ offset_skin + 7 ] = sw2.w;

				skinWeightArray[ offset_skin + 8 ]  = sw3.x;
				skinWeightArray[ offset_skin + 9 ]  = sw3.y;
				skinWeightArray[ offset_skin + 10 ] = sw3.z;
				skinWeightArray[ offset_skin + 11 ] = sw3.w;

				// indices

				si1 = obj_skinIndices[ face.a ];
				si2 = obj_skinIndices[ face.b ];
				si3 = obj_skinIndices[ face.c ];

				skinIndexArray[ offset_skin ]     = si1.x;
				skinIndexArray[ offset_skin + 1 ] = si1.y;
				skinIndexArray[ offset_skin + 2 ] = si1.z;
				skinIndexArray[ offset_skin + 3 ] = si1.w;

				skinIndexArray[ offset_skin + 4 ] = si2.x;
				skinIndexArray[ offset_skin + 5 ] = si2.y;
				skinIndexArray[ offset_skin + 6 ] = si2.z;
				skinIndexArray[ offset_skin + 7 ] = si2.w;

				skinIndexArray[ offset_skin + 8 ]  = si3.x;
				skinIndexArray[ offset_skin + 9 ]  = si3.y;
				skinIndexArray[ offset_skin + 10 ] = si3.z;
				skinIndexArray[ offset_skin + 11 ] = si3.w;

				offset_skin += 12;

			}

			if ( offset_skin > 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinIndicesBuffer );
				_gl.bufferData( _gl.ARRAY_BUFFER, skinIndexArray, hint );

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinWeightsBuffer );
				_gl.bufferData( _gl.ARRAY_BUFFER, skinWeightArray, hint );

			}

		}

		if ( dirtyColors ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				face = obj_faces[ chunk_faces3[ f ] ];

				vertexColors = face.vertexColors;
				faceColor = face.color;

				if ( vertexColors.length === 3 && material.vertexColors === THREE.VertexColors ) {

					c1 = vertexColors[ 0 ];
					c2 = vertexColors[ 1 ];
					c3 = vertexColors[ 2 ];

				} else {

					c1 = faceColor;
					c2 = faceColor;
					c3 = faceColor;

				}

				colorArray[ offset_color ]     = c1.r;
				colorArray[ offset_color + 1 ] = c1.g;
				colorArray[ offset_color + 2 ] = c1.b;

				colorArray[ offset_color + 3 ] = c2.r;
				colorArray[ offset_color + 4 ] = c2.g;
				colorArray[ offset_color + 5 ] = c2.b;

				colorArray[ offset_color + 6 ] = c3.r;
				colorArray[ offset_color + 7 ] = c3.g;
				colorArray[ offset_color + 8 ] = c3.b;

				offset_color += 9;

			}

			if ( offset_color > 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglColorBuffer );
				_gl.bufferData( _gl.ARRAY_BUFFER, colorArray, hint );

			}

		}

		if ( dirtyTangents && geometry.hasTangents ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				face = obj_faces[ chunk_faces3[ f ] ];

				vertexTangents = face.vertexTangents;

				t1 = vertexTangents[ 0 ];
				t2 = vertexTangents[ 1 ];
				t3 = vertexTangents[ 2 ];

				tangentArray[ offset_tangent ]     = t1.x;
				tangentArray[ offset_tangent + 1 ] = t1.y;
				tangentArray[ offset_tangent + 2 ] = t1.z;
				tangentArray[ offset_tangent + 3 ] = t1.w;

				tangentArray[ offset_tangent + 4 ] = t2.x;
				tangentArray[ offset_tangent + 5 ] = t2.y;
				tangentArray[ offset_tangent + 6 ] = t2.z;
				tangentArray[ offset_tangent + 7 ] = t2.w;

				tangentArray[ offset_tangent + 8 ]  = t3.x;
				tangentArray[ offset_tangent + 9 ]  = t3.y;
				tangentArray[ offset_tangent + 10 ] = t3.z;
				tangentArray[ offset_tangent + 11 ] = t3.w;

				offset_tangent += 12;

			}

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglTangentBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, tangentArray, hint );

		}

		if ( dirtyNormals ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				face = obj_faces[ chunk_faces3[ f ] ];

				vertexNormals = face.vertexNormals;
				faceNormal = face.normal;

				if ( vertexNormals.length === 3 && needsSmoothNormals ) {

					for ( i = 0; i < 3; i ++ ) {

						vn = vertexNormals[ i ];

						normalArray[ offset_normal ]     = vn.x;
						normalArray[ offset_normal + 1 ] = vn.y;
						normalArray[ offset_normal + 2 ] = vn.z;

						offset_normal += 3;

					}

				} else {

					for ( i = 0; i < 3; i ++ ) {

						normalArray[ offset_normal ]     = faceNormal.x;
						normalArray[ offset_normal + 1 ] = faceNormal.y;
						normalArray[ offset_normal + 2 ] = faceNormal.z;

						offset_normal += 3;

					}

				}

			}

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglNormalBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, normalArray, hint );

		}

		if ( dirtyUvs && obj_uvs ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				fi = chunk_faces3[ f ];

				uv = obj_uvs[ fi ];

				if ( uv === undefined ) continue;

				for ( i = 0; i < 3; i ++ ) {

					uvi = uv[ i ];

					uvArray[ offset_uv ]     = uvi.x;
					uvArray[ offset_uv + 1 ] = uvi.y;

					offset_uv += 2;

				}

			}

			if ( offset_uv > 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglUVBuffer );
				_gl.bufferData( _gl.ARRAY_BUFFER, uvArray, hint );

			}

		}

		if ( dirtyUvs && obj_uvs2 ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				fi = chunk_faces3[ f ];

				uv2 = obj_uvs2[ fi ];

				if ( uv2 === undefined ) continue;

				for ( i = 0; i < 3; i ++ ) {

					uv2i = uv2[ i ];

					uv2Array[ offset_uv2 ]     = uv2i.x;
					uv2Array[ offset_uv2 + 1 ] = uv2i.y;

					offset_uv2 += 2;

				}

			}

			if ( offset_uv2 > 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglUV2Buffer );
				_gl.bufferData( _gl.ARRAY_BUFFER, uv2Array, hint );

			}

		}

		if ( dirtyElements ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				faceArray[ offset_face ]   = vertexIndex;
				faceArray[ offset_face + 1 ] = vertexIndex + 1;
				faceArray[ offset_face + 2 ] = vertexIndex + 2;

				offset_face += 3;

				lineArray[ offset_line ]     = vertexIndex;
				lineArray[ offset_line + 1 ] = vertexIndex + 1;

				lineArray[ offset_line + 2 ] = vertexIndex;
				lineArray[ offset_line + 3 ] = vertexIndex + 2;

				lineArray[ offset_line + 4 ] = vertexIndex + 1;
				lineArray[ offset_line + 5 ] = vertexIndex + 2;

				offset_line += 6;

				vertexIndex += 3;

			}

			_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, geometryGroup.__webglFaceBuffer );
			_gl.bufferData( _gl.ELEMENT_ARRAY_BUFFER, faceArray, hint );

			_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, geometryGroup.__webglLineBuffer );
			_gl.bufferData( _gl.ELEMENT_ARRAY_BUFFER, lineArray, hint );

		}

		if ( customAttributes ) {

			for ( i = 0, il = customAttributes.length; i < il; i ++ ) {

				customAttribute = customAttributes[ i ];

				if ( ! customAttribute.__original.needsUpdate ) continue;

				offset_custom = 0;
				offset_customSrc = 0;

				if ( customAttribute.size === 1 ) {

					if ( customAttribute.boundTo === undefined || customAttribute.boundTo === 'vertices' ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							face = obj_faces[ chunk_faces3[ f ] ];

							customAttribute.array[ offset_custom ]     = customAttribute.value[ face.a ];
							customAttribute.array[ offset_custom + 1 ] = customAttribute.value[ face.b ];
							customAttribute.array[ offset_custom + 2 ] = customAttribute.value[ face.c ];

							offset_custom += 3;

						}

					} else if ( customAttribute.boundTo === 'faces' ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							value = customAttribute.value[ chunk_faces3[ f ] ];

							customAttribute.array[ offset_custom ]     = value;
							customAttribute.array[ offset_custom + 1 ] = value;
							customAttribute.array[ offset_custom + 2 ] = value;

							offset_custom += 3;

						}

					}

				} else if ( customAttribute.size === 2 ) {

					if ( customAttribute.boundTo === undefined || customAttribute.boundTo === 'vertices' ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							face = obj_faces[ chunk_faces3[ f ] ];

							v1 = customAttribute.value[ face.a ];
							v2 = customAttribute.value[ face.b ];
							v3 = customAttribute.value[ face.c ];

							customAttribute.array[ offset_custom ]     = v1.x;
							customAttribute.array[ offset_custom + 1 ] = v1.y;

							customAttribute.array[ offset_custom + 2 ] = v2.x;
							customAttribute.array[ offset_custom + 3 ] = v2.y;

							customAttribute.array[ offset_custom + 4 ] = v3.x;
							customAttribute.array[ offset_custom + 5 ] = v3.y;

							offset_custom += 6;

						}

					} else if ( customAttribute.boundTo === 'faces' ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							value = customAttribute.value[ chunk_faces3[ f ] ];

							v1 = value;
							v2 = value;
							v3 = value;

							customAttribute.array[ offset_custom ]     = v1.x;
							customAttribute.array[ offset_custom + 1 ] = v1.y;

							customAttribute.array[ offset_custom + 2 ] = v2.x;
							customAttribute.array[ offset_custom + 3 ] = v2.y;

							customAttribute.array[ offset_custom + 4 ] = v3.x;
							customAttribute.array[ offset_custom + 5 ] = v3.y;

							offset_custom += 6;

						}

					}

				} else if ( customAttribute.size === 3 ) {

					var pp;

					if ( customAttribute.type === 'c' ) {

						pp = [ 'r', 'g', 'b' ];

					} else {

						pp = [ 'x', 'y', 'z' ];

					}

					if ( customAttribute.boundTo === undefined || customAttribute.boundTo === 'vertices' ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							face = obj_faces[ chunk_faces3[ f ] ];

							v1 = customAttribute.value[ face.a ];
							v2 = customAttribute.value[ face.b ];
							v3 = customAttribute.value[ face.c ];

							customAttribute.array[ offset_custom ]     = v1[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 1 ] = v1[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 2 ] = v1[ pp[ 2 ] ];

							customAttribute.array[ offset_custom + 3 ] = v2[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 4 ] = v2[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 5 ] = v2[ pp[ 2 ] ];

							customAttribute.array[ offset_custom + 6 ] = v3[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 7 ] = v3[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 8 ] = v3[ pp[ 2 ] ];

							offset_custom += 9;

						}

					} else if ( customAttribute.boundTo === 'faces' ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							value = customAttribute.value[ chunk_faces3[ f ] ];

							v1 = value;
							v2 = value;
							v3 = value;

							customAttribute.array[ offset_custom ]     = v1[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 1 ] = v1[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 2 ] = v1[ pp[ 2 ] ];

							customAttribute.array[ offset_custom + 3 ] = v2[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 4 ] = v2[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 5 ] = v2[ pp[ 2 ] ];

							customAttribute.array[ offset_custom + 6 ] = v3[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 7 ] = v3[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 8 ] = v3[ pp[ 2 ] ];

							offset_custom += 9;

						}

					} else if ( customAttribute.boundTo === 'faceVertices' ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							value = customAttribute.value[ chunk_faces3[ f ] ];

							v1 = value[ 0 ];
							v2 = value[ 1 ];
							v3 = value[ 2 ];

							customAttribute.array[ offset_custom ]     = v1[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 1 ] = v1[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 2 ] = v1[ pp[ 2 ] ];

							customAttribute.array[ offset_custom + 3 ] = v2[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 4 ] = v2[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 5 ] = v2[ pp[ 2 ] ];

							customAttribute.array[ offset_custom + 6 ] = v3[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 7 ] = v3[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 8 ] = v3[ pp[ 2 ] ];

							offset_custom += 9;

						}

					}

				} else if ( customAttribute.size === 4 ) {

					if ( customAttribute.boundTo === undefined || customAttribute.boundTo === 'vertices' ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							face = obj_faces[ chunk_faces3[ f ] ];

							v1 = customAttribute.value[ face.a ];
							v2 = customAttribute.value[ face.b ];
							v3 = customAttribute.value[ face.c ];

							customAttribute.array[ offset_custom  ]   = v1.x;
							customAttribute.array[ offset_custom + 1  ] = v1.y;
							customAttribute.array[ offset_custom + 2  ] = v1.z;
							customAttribute.array[ offset_custom + 3  ] = v1.w;

							customAttribute.array[ offset_custom + 4  ] = v2.x;
							customAttribute.array[ offset_custom + 5  ] = v2.y;
							customAttribute.array[ offset_custom + 6  ] = v2.z;
							customAttribute.array[ offset_custom + 7  ] = v2.w;

							customAttribute.array[ offset_custom + 8  ] = v3.x;
							customAttribute.array[ offset_custom + 9  ] = v3.y;
							customAttribute.array[ offset_custom + 10 ] = v3.z;
							customAttribute.array[ offset_custom + 11 ] = v3.w;

							offset_custom += 12;

						}

					} else if ( customAttribute.boundTo === 'faces' ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							value = customAttribute.value[ chunk_faces3[ f ] ];

							v1 = value;
							v2 = value;
							v3 = value;

							customAttribute.array[ offset_custom  ]   = v1.x;
							customAttribute.array[ offset_custom + 1  ] = v1.y;
							customAttribute.array[ offset_custom + 2  ] = v1.z;
							customAttribute.array[ offset_custom + 3  ] = v1.w;

							customAttribute.array[ offset_custom + 4  ] = v2.x;
							customAttribute.array[ offset_custom + 5  ] = v2.y;
							customAttribute.array[ offset_custom + 6  ] = v2.z;
							customAttribute.array[ offset_custom + 7  ] = v2.w;

							customAttribute.array[ offset_custom + 8  ] = v3.x;
							customAttribute.array[ offset_custom + 9  ] = v3.y;
							customAttribute.array[ offset_custom + 10 ] = v3.z;
							customAttribute.array[ offset_custom + 11 ] = v3.w;

							offset_custom += 12;

						}

					} else if ( customAttribute.boundTo === 'faceVertices' ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							value = customAttribute.value[ chunk_faces3[ f ] ];

							v1 = value[ 0 ];
							v2 = value[ 1 ];
							v3 = value[ 2 ];

							customAttribute.array[ offset_custom  ]   = v1.x;
							customAttribute.array[ offset_custom + 1  ] = v1.y;
							customAttribute.array[ offset_custom + 2  ] = v1.z;
							customAttribute.array[ offset_custom + 3  ] = v1.w;

							customAttribute.array[ offset_custom + 4  ] = v2.x;
							customAttribute.array[ offset_custom + 5  ] = v2.y;
							customAttribute.array[ offset_custom + 6  ] = v2.z;
							customAttribute.array[ offset_custom + 7  ] = v2.w;

							customAttribute.array[ offset_custom + 8  ] = v3.x;
							customAttribute.array[ offset_custom + 9  ] = v3.y;
							customAttribute.array[ offset_custom + 10 ] = v3.z;
							customAttribute.array[ offset_custom + 11 ] = v3.w;

							offset_custom += 12;

						}

					}

				}

				_gl.bindBuffer( _gl.ARRAY_BUFFER, customAttribute.buffer );
				_gl.bufferData( _gl.ARRAY_BUFFER, customAttribute.array, hint );

			}

		}

		if ( dispose ) {

			delete geometryGroup.__inittedArrays;
			delete geometryGroup.__colorArray;
			delete geometryGroup.__normalArray;
			delete geometryGroup.__tangentArray;
			delete geometryGroup.__uvArray;
			delete geometryGroup.__uv2Array;
			delete geometryGroup.__faceArray;
			delete geometryGroup.__vertexArray;
			delete geometryGroup.__lineArray;
			delete geometryGroup.__skinIndexArray;
			delete geometryGroup.__skinWeightArray;

		}

	};

	function setDirectBuffers( geometry ) {

		var attributes = geometry.attributes;
		var attributesKeys = geometry.attributesKeys;

		for ( var i = 0, l = attributesKeys.length; i < l; i ++ ) {

			var key = attributesKeys[ i ];
			var attribute = attributes[ key ];

			if ( attribute.buffer === undefined ) {

				attribute.buffer = _gl.createBuffer();
				attribute.needsUpdate = true;

			}

			if ( attribute.needsUpdate === true ) {

				var bufferType = ( key === 'index' ) ? _gl.ELEMENT_ARRAY_BUFFER : _gl.ARRAY_BUFFER;

				_gl.bindBuffer( bufferType, attribute.buffer );
				_gl.bufferData( bufferType, attribute.array, _gl.STATIC_DRAW );

				attribute.needsUpdate = false;

			}

		}

	}

	// Buffer rendering

	this.renderBufferImmediate = function ( object, program, material ) {

		initAttributes();

		if ( object.hasPositions && ! object.__webglVertexBuffer ) object.__webglVertexBuffer = _gl.createBuffer();
		if ( object.hasNormals && ! object.__webglNormalBuffer ) object.__webglNormalBuffer = _gl.createBuffer();
		if ( object.hasUvs && ! object.__webglUvBuffer ) object.__webglUvBuffer = _gl.createBuffer();
		if ( object.hasColors && ! object.__webglColorBuffer ) object.__webglColorBuffer = _gl.createBuffer();

		if ( object.hasPositions ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, object.__webglVertexBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, object.positionArray, _gl.DYNAMIC_DRAW );
			enableAttribute( program.attributes.position );
			_gl.vertexAttribPointer( program.attributes.position, 3, _gl.FLOAT, false, 0, 0 );

		}

		if ( object.hasNormals ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, object.__webglNormalBuffer );

			if ( material.shading === THREE.FlatShading ) {

				var nx, ny, nz,
					nax, nbx, ncx, nay, nby, ncy, naz, nbz, ncz,
					normalArray,
					i, il = object.count * 3;

				for ( i = 0; i < il; i += 9 ) {

					normalArray = object.normalArray;

					nax  = normalArray[ i ];
					nay  = normalArray[ i + 1 ];
					naz  = normalArray[ i + 2 ];

					nbx  = normalArray[ i + 3 ];
					nby  = normalArray[ i + 4 ];
					nbz  = normalArray[ i + 5 ];

					ncx  = normalArray[ i + 6 ];
					ncy  = normalArray[ i + 7 ];
					ncz  = normalArray[ i + 8 ];

					nx = ( nax + nbx + ncx ) / 3;
					ny = ( nay + nby + ncy ) / 3;
					nz = ( naz + nbz + ncz ) / 3;

					normalArray[ i ]   = nx;
					normalArray[ i + 1 ] = ny;
					normalArray[ i + 2 ] = nz;

					normalArray[ i + 3 ] = nx;
					normalArray[ i + 4 ] = ny;
					normalArray[ i + 5 ] = nz;

					normalArray[ i + 6 ] = nx;
					normalArray[ i + 7 ] = ny;
					normalArray[ i + 8 ] = nz;

				}

			}

			_gl.bufferData( _gl.ARRAY_BUFFER, object.normalArray, _gl.DYNAMIC_DRAW );
			enableAttribute( program.attributes.normal );
			_gl.vertexAttribPointer( program.attributes.normal, 3, _gl.FLOAT, false, 0, 0 );

		}

		if ( object.hasUvs && material.map ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, object.__webglUvBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, object.uvArray, _gl.DYNAMIC_DRAW );
			enableAttribute( program.attributes.uv );
			_gl.vertexAttribPointer( program.attributes.uv, 2, _gl.FLOAT, false, 0, 0 );

		}

		if ( object.hasColors && material.vertexColors !== THREE.NoColors ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, object.__webglColorBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, object.colorArray, _gl.DYNAMIC_DRAW );
			enableAttribute( program.attributes.color );
			_gl.vertexAttribPointer( program.attributes.color, 3, _gl.FLOAT, false, 0, 0 );

		}

		disableUnusedAttributes();

		_gl.drawArrays( _gl.TRIANGLES, 0, object.count );

		object.count = 0;

	};

	function setupVertexAttributes( material, program, geometry, startIndex ) {

		var geometryAttributes = geometry.attributes;

		var programAttributes = program.attributes;
		var programAttributesKeys = program.attributesKeys;

		for ( var i = 0, l = programAttributesKeys.length; i < l; i ++ ) {

			var key = programAttributesKeys[ i ];
			var programAttribute = programAttributes[ key ];

			if ( programAttribute >= 0 ) {

				var geometryAttribute = geometryAttributes[ key ];

				if ( geometryAttribute !== undefined ) {

					var size = geometryAttribute.itemSize;

					_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryAttribute.buffer );

					enableAttribute( programAttribute );

					_gl.vertexAttribPointer( programAttribute, size, _gl.FLOAT, false, 0, startIndex * size * 4 ); // 4 bytes per Float32

				} else if ( material.defaultAttributeValues !== undefined ) {

					if ( material.defaultAttributeValues[ key ].length === 2 ) {

						_gl.vertexAttrib2fv( programAttribute, material.defaultAttributeValues[ key ] );

					} else if ( material.defaultAttributeValues[ key ].length === 3 ) {

						_gl.vertexAttrib3fv( programAttribute, material.defaultAttributeValues[ key ] );

					}

				}

			}

		}

		disableUnusedAttributes();

	}

	this.renderBufferDirect = function ( camera, lights, fog, material, geometry, object ) {

		if ( material.visible === false ) return;

		var program = setProgram( camera, lights, fog, material, object );

		var updateBuffers = false,
			wireframeBit = material.wireframe ? 1 : 0,
			geometryHash = ( geometry.id * 0xffffff ) + ( program.id * 2 ) + wireframeBit;

		if ( geometryHash !== _currentGeometryGroupHash ) {

			_currentGeometryGroupHash = geometryHash;
			updateBuffers = true;

		}

		if ( updateBuffers ) {

			initAttributes();

		}

		// render mesh

		if ( object instanceof THREE.Mesh ) {

			var mode = material.wireframe === true ? _gl.LINES : _gl.TRIANGLES;

			var index = geometry.attributes.index;

			if ( index ) {

				// indexed triangles

				var type, size;

				if ( index.array instanceof Uint32Array && extensions.get( 'OES_element_index_uint' ) ) {

					type = _gl.UNSIGNED_INT;
					size = 4;

				} else {

					type = _gl.UNSIGNED_SHORT;
					size = 2;

				}

				var offsets = geometry.offsets;

				if ( offsets.length === 0 ) {

					if ( updateBuffers ) {

						setupVertexAttributes( material, program, geometry, 0 );
						_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, index.buffer );

					}

					_gl.drawElements( mode, index.array.length, type, 0 );

					_this.info.render.calls ++;
					_this.info.render.vertices += index.array.length; // not really true, here vertices can be shared
					_this.info.render.faces += index.array.length / 3;

				} else {

					// if there is more than 1 chunk
					// must set attribute pointers to use new offsets for each chunk
					// even if geometry and materials didn't change

					updateBuffers = true;

					for ( var i = 0, il = offsets.length; i < il; i ++ ) {

						var startIndex = offsets[ i ].index;

						if ( updateBuffers ) {

							setupVertexAttributes( material, program, geometry, startIndex );
							_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, index.buffer );

						}

						// render indexed triangles

						_gl.drawElements( mode, offsets[ i ].count, type, offsets[ i ].start * size );

						_this.info.render.calls ++;
						_this.info.render.vertices += offsets[ i ].count; // not really true, here vertices can be shared
						_this.info.render.faces += offsets[ i ].count / 3;

					}

				}

			} else {

				// non-indexed triangles

				if ( updateBuffers ) {

					setupVertexAttributes( material, program, geometry, 0 );

				}

				var position = geometry.attributes[ 'position' ];

				// render non-indexed triangles

				_gl.drawArrays( mode, 0, position.array.length / 3 );

				_this.info.render.calls ++;
				_this.info.render.vertices += position.array.length / 3;
				_this.info.render.faces += position.array.length / 9;

			}

		} else if ( object instanceof THREE.PointCloud ) {

			// render particles

			if ( updateBuffers ) {

				setupVertexAttributes( material, program, geometry, 0 );

			}

			var position = geometry.attributes.position;

			// render particles

			_gl.drawArrays( _gl.POINTS, 0, position.array.length / 3 );

			_this.info.render.calls ++;
			_this.info.render.points += position.array.length / 3;

		} else if ( object instanceof THREE.Line ) {

			var mode = ( object.mode === THREE.LineStrip ) ? _gl.LINE_STRIP : _gl.LINES;

			setLineWidth( material.linewidth );

			var index = geometry.attributes.index;

			if ( index ) {

				// indexed lines

				var type, size;

				if ( index.array instanceof Uint32Array ) {

					type = _gl.UNSIGNED_INT;
					size = 4;

				} else {

					type = _gl.UNSIGNED_SHORT;
					size = 2;

				}

				var offsets = geometry.offsets;

				if ( offsets.length === 0 ) {

					if ( updateBuffers ) {

						setupVertexAttributes( material, program, geometry, 0 );
						_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, index.buffer );

					}

					_gl.drawElements( mode, index.array.length, type, 0 ); // 2 bytes per Uint16Array

					_this.info.render.calls ++;
					_this.info.render.vertices += index.array.length; // not really true, here vertices can be shared

				} else {

					// if there is more than 1 chunk
					// must set attribute pointers to use new offsets for each chunk
					// even if geometry and materials didn't change

					if ( offsets.length > 1 ) updateBuffers = true;

					for ( var i = 0, il = offsets.length; i < il; i ++ ) {

						var startIndex = offsets[ i ].index;

						if ( updateBuffers ) {

							setupVertexAttributes( material, program, geometry, startIndex );
							_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, index.buffer );

						}

						// render indexed lines

						_gl.drawElements( mode, offsets[ i ].count, type, offsets[ i ].start * size ); // 2 bytes per Uint16Array

						_this.info.render.calls ++;
						_this.info.render.vertices += offsets[ i ].count; // not really true, here vertices can be shared

					}

				}

			} else {

				// non-indexed lines

				if ( updateBuffers ) {

					setupVertexAttributes( material, program, geometry, 0 );

				}

				var position = geometry.attributes.position;

				_gl.drawArrays( mode, 0, position.array.length / 3 );

				_this.info.render.calls ++;
				_this.info.render.points += position.array.length / 3;

			}

		}

	};

	this.renderBuffer = function ( camera, lights, fog, material, geometryGroup, object ) {

		if ( material.visible === false ) return;

		var program = setProgram( camera, lights, fog, material, object );

		var attributes = program.attributes;

		var updateBuffers = false,
			wireframeBit = material.wireframe ? 1 : 0,
			geometryGroupHash = ( geometryGroup.id * 0xffffff ) + ( program.id * 2 ) + wireframeBit;

		if ( geometryGroupHash !== _currentGeometryGroupHash ) {

			_currentGeometryGroupHash = geometryGroupHash;
			updateBuffers = true;

		}

		if ( updateBuffers ) {

			initAttributes();

		}

		// vertices

		if ( ! material.morphTargets && attributes.position >= 0 ) {

			if ( updateBuffers ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglVertexBuffer );
				enableAttribute( attributes.position );
				_gl.vertexAttribPointer( attributes.position, 3, _gl.FLOAT, false, 0, 0 );

			}

		} else {

			if ( object.morphTargetBase ) {

				setupMorphTargets( material, geometryGroup, object );

			}

		}


		if ( updateBuffers ) {

			// custom attributes

			// Use the per-geometryGroup custom attribute arrays which are setup in initMeshBuffers

			if ( geometryGroup.__webglCustomAttributesList ) {

				for ( var i = 0, il = geometryGroup.__webglCustomAttributesList.length; i < il; i ++ ) {

					var attribute = geometryGroup.__webglCustomAttributesList[ i ];

					if ( attributes[ attribute.buffer.belongsToAttribute ] >= 0 ) {

						_gl.bindBuffer( _gl.ARRAY_BUFFER, attribute.buffer );
						enableAttribute( attributes[ attribute.buffer.belongsToAttribute ] );
						_gl.vertexAttribPointer( attributes[ attribute.buffer.belongsToAttribute ], attribute.size, _gl.FLOAT, false, 0, 0 );

					}

				}

			}


			// colors

			if ( attributes.color >= 0 ) {

				if ( object.geometry.colors.length > 0 || object.geometry.faces.length > 0 ) {

					_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglColorBuffer );
					enableAttribute( attributes.color );
					_gl.vertexAttribPointer( attributes.color, 3, _gl.FLOAT, false, 0, 0 );

				} else if ( material.defaultAttributeValues !== undefined ) {


					_gl.vertexAttrib3fv( attributes.color, material.defaultAttributeValues.color );

				}

			}

			// normals

			if ( attributes.normal >= 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglNormalBuffer );
				enableAttribute( attributes.normal );
				_gl.vertexAttribPointer( attributes.normal, 3, _gl.FLOAT, false, 0, 0 );

			}

			// tangents

			if ( attributes.tangent >= 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglTangentBuffer );
				enableAttribute( attributes.tangent );
				_gl.vertexAttribPointer( attributes.tangent, 4, _gl.FLOAT, false, 0, 0 );

			}

			// uvs

			if ( attributes.uv >= 0 ) {

				if ( object.geometry.faceVertexUvs[ 0 ] ) {

					_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglUVBuffer );
					enableAttribute( attributes.uv );
					_gl.vertexAttribPointer( attributes.uv, 2, _gl.FLOAT, false, 0, 0 );

				} else if ( material.defaultAttributeValues !== undefined ) {


					_gl.vertexAttrib2fv( attributes.uv, material.defaultAttributeValues.uv );

				}

			}

			if ( attributes.uv2 >= 0 ) {

				if ( object.geometry.faceVertexUvs[ 1 ] ) {

					_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglUV2Buffer );
					enableAttribute( attributes.uv2 );
					_gl.vertexAttribPointer( attributes.uv2, 2, _gl.FLOAT, false, 0, 0 );

				} else if ( material.defaultAttributeValues !== undefined ) {


					_gl.vertexAttrib2fv( attributes.uv2, material.defaultAttributeValues.uv2 );

				}

			}

			if ( material.skinning &&
				 attributes.skinIndex >= 0 && attributes.skinWeight >= 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinIndicesBuffer );
				enableAttribute( attributes.skinIndex );
				_gl.vertexAttribPointer( attributes.skinIndex, 4, _gl.FLOAT, false, 0, 0 );

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinWeightsBuffer );
				enableAttribute( attributes.skinWeight );
				_gl.vertexAttribPointer( attributes.skinWeight, 4, _gl.FLOAT, false, 0, 0 );

			}

			// line distances

			if ( attributes.lineDistance >= 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglLineDistanceBuffer );
				enableAttribute( attributes.lineDistance );
				_gl.vertexAttribPointer( attributes.lineDistance, 1, _gl.FLOAT, false, 0, 0 );

			}

		}

		disableUnusedAttributes();

		// render mesh

		if ( object instanceof THREE.Mesh ) {

			var type = geometryGroup.__typeArray === Uint32Array ? _gl.UNSIGNED_INT : _gl.UNSIGNED_SHORT;

			// wireframe

			if ( material.wireframe ) {

				setLineWidth( material.wireframeLinewidth );
				if ( updateBuffers ) _gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, geometryGroup.__webglLineBuffer );
				_gl.drawElements( _gl.LINES, geometryGroup.__webglLineCount, type, 0 );

			// triangles

			} else {

				if ( updateBuffers ) _gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, geometryGroup.__webglFaceBuffer );
				_gl.drawElements( _gl.TRIANGLES, geometryGroup.__webglFaceCount, type, 0 );

			}

			_this.info.render.calls ++;
			_this.info.render.vertices += geometryGroup.__webglFaceCount;
			_this.info.render.faces += geometryGroup.__webglFaceCount / 3;

		// render lines

		} else if ( object instanceof THREE.Line ) {

			var mode = ( object.mode === THREE.LineStrip ) ? _gl.LINE_STRIP : _gl.LINES;

			setLineWidth( material.linewidth );

			_gl.drawArrays( mode, 0, geometryGroup.__webglLineCount );

			_this.info.render.calls ++;

		// render particles

		} else if ( object instanceof THREE.PointCloud ) {

			_gl.drawArrays( _gl.POINTS, 0, geometryGroup.__webglParticleCount );

			_this.info.render.calls ++;
			_this.info.render.points += geometryGroup.__webglParticleCount;

		}

	};

	function initAttributes() {

		for ( var i = 0, l = _newAttributes.length; i < l; i ++ ) {

			_newAttributes[ i ] = 0;

		}

	}

	function enableAttribute( attribute ) {

		_newAttributes[ attribute ] = 1;

		if ( _enabledAttributes[ attribute ] === 0 ) {

			_gl.enableVertexAttribArray( attribute );
			_enabledAttributes[ attribute ] = 1;

		}

	}

	function disableUnusedAttributes() {

		for ( var i = 0, l = _enabledAttributes.length; i < l; i ++ ) {

			if ( _enabledAttributes[ i ] !== _newAttributes[ i ] ) {

				_gl.disableVertexAttribArray( i );
				_enabledAttributes[ i ] = 0;

			}

		}

	}

	function setupMorphTargets ( material, geometryGroup, object ) {

		// set base

		var attributes = material.program.attributes;

		if ( object.morphTargetBase !== - 1 && attributes.position >= 0 ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglMorphTargetsBuffers[ object.morphTargetBase ] );
			enableAttribute( attributes.position );
			_gl.vertexAttribPointer( attributes.position, 3, _gl.FLOAT, false, 0, 0 );

		} else if ( attributes.position >= 0 ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglVertexBuffer );
			enableAttribute( attributes.position );
			_gl.vertexAttribPointer( attributes.position, 3, _gl.FLOAT, false, 0, 0 );

		}

		if ( object.morphTargetForcedOrder.length ) {

			// set forced order

			var m = 0;
			var order = object.morphTargetForcedOrder;
			var influences = object.morphTargetInfluences;

			while ( m < material.numSupportedMorphTargets && m < order.length ) {

				if ( attributes[ 'morphTarget' + m ] >= 0 ) {

					_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglMorphTargetsBuffers[ order[ m ] ] );
					enableAttribute( attributes[ 'morphTarget' + m ] );
					_gl.vertexAttribPointer( attributes[ 'morphTarget' + m ], 3, _gl.FLOAT, false, 0, 0 );

				}

				if ( attributes[ 'morphNormal' + m ] >= 0 && material.morphNormals ) {

					_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglMorphNormalsBuffers[ order[ m ] ] );
					enableAttribute( attributes[ 'morphNormal' + m ] );
					_gl.vertexAttribPointer( attributes[ 'morphNormal' + m ], 3, _gl.FLOAT, false, 0, 0 );

				}

				object.__webglMorphTargetInfluences[ m ] = influences[ order[ m ] ];

				m ++;
			}

		} else {

			// find the most influencing

			var influence, activeInfluenceIndices = [];
			var influences = object.morphTargetInfluences;
			var i, il = influences.length;

			for ( i = 0; i < il; i ++ ) {

				influence = influences[ i ];

				if ( influence > 0 ) {

					activeInfluenceIndices.push( [ influence, i ] );

				}

			}

			if ( activeInfluenceIndices.length > material.numSupportedMorphTargets ) {

				activeInfluenceIndices.sort( numericalSort );
				activeInfluenceIndices.length = material.numSupportedMorphTargets;

			} else if ( activeInfluenceIndices.length > material.numSupportedMorphNormals ) {

				activeInfluenceIndices.sort( numericalSort );

			} else if ( activeInfluenceIndices.length === 0 ) {

				activeInfluenceIndices.push( [ 0, 0 ] );

			};

			var influenceIndex, m = 0;

			while ( m < material.numSupportedMorphTargets ) {

				if ( activeInfluenceIndices[ m ] ) {

					influenceIndex = activeInfluenceIndices[ m ][ 1 ];

					if ( attributes[ 'morphTarget' + m ] >= 0 ) {

						_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglMorphTargetsBuffers[ influenceIndex ] );
						enableAttribute( attributes[ 'morphTarget' + m ] );
						_gl.vertexAttribPointer( attributes[ 'morphTarget' + m ], 3, _gl.FLOAT, false, 0, 0 );

					}

					if ( attributes[ 'morphNormal' + m ] >= 0 && material.morphNormals ) {

						_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglMorphNormalsBuffers[ influenceIndex ] );
						enableAttribute( attributes[ 'morphNormal' + m ] );
						_gl.vertexAttribPointer( attributes[ 'morphNormal' + m ], 3, _gl.FLOAT, false, 0, 0 );


					}

					object.__webglMorphTargetInfluences[ m ] = influences[ influenceIndex ];

				} else {

					/*
					_gl.vertexAttribPointer( attributes[ "morphTarget" + m ], 3, _gl.FLOAT, false, 0, 0 );

					if ( material.morphNormals ) {

						_gl.vertexAttribPointer( attributes[ "morphNormal" + m ], 3, _gl.FLOAT, false, 0, 0 );

					}
					*/

					object.__webglMorphTargetInfluences[ m ] = 0;

				}

				m ++;

			}

		}

		// load updated influences uniform

		if ( material.program.uniforms.morphTargetInfluences !== null ) {

			_gl.uniform1fv( material.program.uniforms.morphTargetInfluences, object.__webglMorphTargetInfluences );

		}

	}

	// Sorting

	function painterSortStable ( a, b ) {

		if ( a.material.id !== b.material.id ) {

			return b.material.id - a.material.id;

		} else if ( a.z !== b.z ) {

			return b.z - a.z;

		} else {

			return a.id - b.id;

		}

	}

	function reversePainterSortStable ( a, b ) {

		if ( a.z !== b.z ) {

			return a.z - b.z;

		} else {

			return a.id - b.id;

		}

	}

	function numericalSort ( a, b ) {

		return b[ 0 ] - a[ 0 ];

	}

	// Rendering

	this.render = function ( scene, camera, renderTarget, forceClear ) {

		if ( camera instanceof THREE.Camera === false ) {

			console.error( 'THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.' );
			return;

		}

		var fog = scene.fog;

		// reset caching for this frame

		_currentGeometryGroupHash = - 1;
		_currentMaterialId = - 1;
		_currentCamera = null;
		_lightsNeedUpdate = true;

		// update scene graph

		if ( scene.autoUpdate === true ) scene.updateMatrixWorld();

		// update camera matrices and frustum

		if ( camera.parent === undefined ) camera.updateMatrixWorld();

		// update Skeleton objects

		scene.traverse( function ( object ) {

			if ( object instanceof THREE.SkinnedMesh ) {

				object.skeleton.update();

			}

		} );

		camera.matrixWorldInverse.getInverse( camera.matrixWorld );

		_projScreenMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
		_frustum.setFromMatrix( _projScreenMatrix );

		lights.length = 0;
		opaqueObjects.length = 0;
		transparentObjects.length = 0;

		sprites.length = 0;
		lensFlares.length = 0;

		projectObject( scene, scene );

		if ( _this.sortObjects === true ) {

			opaqueObjects.sort( painterSortStable );
			transparentObjects.sort( reversePainterSortStable );

		}

		// custom render plugins (pre pass)

		shadowMapPlugin.render( scene, camera );

		//

		_this.info.render.calls = 0;
		_this.info.render.vertices = 0;
		_this.info.render.faces = 0;
		_this.info.render.points = 0;

		this.setRenderTarget( renderTarget );

		if ( this.autoClear || forceClear ) {

			this.clear( this.autoClearColor, this.autoClearDepth, this.autoClearStencil );

		}

		// set matrices for immediate objects

		for ( var i = 0, il = _webglObjectsImmediate.length; i < il; i ++ ) {

			var webglObject = _webglObjectsImmediate[ i ];
			var object = webglObject.object;

			if ( object.visible ) {

				setupMatrices( object, camera );

				unrollImmediateBufferMaterial( webglObject );

			}

		}

		if ( scene.overrideMaterial ) {

			var material = scene.overrideMaterial;

			this.setBlending( material.blending, material.blendEquation, material.blendSrc, material.blendDst );
			this.setDepthTest( material.depthTest );
			this.setDepthWrite( material.depthWrite );
			setPolygonOffset( material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits );

			renderObjects( opaqueObjects, camera, lights, fog, true, material );
			renderObjects( transparentObjects, camera, lights, fog, true, material );
			renderObjectsImmediate( _webglObjectsImmediate, '', camera, lights, fog, false, material );

		} else {

			var material = null;

			// opaque pass (front-to-back order)

			this.setBlending( THREE.NoBlending );

			renderObjects( opaqueObjects, camera, lights, fog, false, material );
			renderObjectsImmediate( _webglObjectsImmediate, 'opaque', camera, lights, fog, false, material );

			// transparent pass (back-to-front order)

			renderObjects( transparentObjects, camera, lights, fog, true, material );
			renderObjectsImmediate( _webglObjectsImmediate, 'transparent', camera, lights, fog, true, material );

		}

		// custom render plugins (post pass)

		spritePlugin.render( scene, camera );
		lensFlarePlugin.render( scene, camera, _currentWidth, _currentHeight );

		// Generate mipmap if we're using any kind of mipmap filtering

		if ( renderTarget && renderTarget.generateMipmaps && renderTarget.minFilter !== THREE.NearestFilter && renderTarget.minFilter !== THREE.LinearFilter ) {

			updateRenderTargetMipmap( renderTarget );

		}

		// Ensure depth buffer writing is enabled so it can be cleared on next render

		this.setDepthTest( true );
		this.setDepthWrite( true );

		// _gl.finish();

	};

	function projectObject( scene, object ) {

		if ( object.visible === false ) return;

		if ( object instanceof THREE.Scene || object instanceof THREE.Group ) {

			// skip

		} else {

			initObject( object, scene );

			if ( object instanceof THREE.Light ) {

				lights.push( object );

			} else if ( object instanceof THREE.Sprite ) {

				sprites.push( object );

			} else if ( object instanceof THREE.LensFlare ) {

				lensFlares.push( object );

			} else {

				var webglObjects = _webglObjects[ object.id ];

				if ( webglObjects && ( object.frustumCulled === false || _frustum.intersectsObject( object ) === true ) ) {

					updateObject( object, scene );

					for ( var i = 0, l = webglObjects.length; i < l; i ++ ) {

						var webglObject = webglObjects[i];

						unrollBufferMaterial( webglObject );

						webglObject.render = true;

						if ( _this.sortObjects === true ) {

							if ( object.renderDepth !== null ) {

								webglObject.z = object.renderDepth;

							} else {

								_vector3.setFromMatrixPosition( object.matrixWorld );
								_vector3.applyProjection( _projScreenMatrix );

								webglObject.z = _vector3.z;

							}

						}

					}

				}

			}

		}

		for ( var i = 0, l = object.children.length; i < l; i ++ ) {

			projectObject( scene, object.children[ i ] );

		}

	}

	function renderObjects( renderList, camera, lights, fog, useBlending, overrideMaterial ) {

		var material;

		for ( var i = renderList.length - 1; i !== - 1; i -- ) {

			var webglObject = renderList[ i ];

			var object = webglObject.object;
			var buffer = webglObject.buffer;

			setupMatrices( object, camera );

			if ( overrideMaterial ) {

				material = overrideMaterial;

			} else {

				material = webglObject.material;

				if ( ! material ) continue;

				if ( useBlending ) _this.setBlending( material.blending, material.blendEquation, material.blendSrc, material.blendDst );

				_this.setDepthTest( material.depthTest );
				_this.setDepthWrite( material.depthWrite );
				setPolygonOffset( material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits );

			}

			_this.setMaterialFaces( material );

			if ( buffer instanceof THREE.BufferGeometry ) {

				_this.renderBufferDirect( camera, lights, fog, material, buffer, object );

			} else {

				_this.renderBuffer( camera, lights, fog, material, buffer, object );

			}

		}

	}

	function renderObjectsImmediate ( renderList, materialType, camera, lights, fog, useBlending, overrideMaterial ) {

		var material;

		for ( var i = 0, il = renderList.length; i < il; i ++ ) {

			var webglObject = renderList[ i ];
			var object = webglObject.object;

			if ( object.visible ) {

				if ( overrideMaterial ) {

					material = overrideMaterial;

				} else {

					material = webglObject[ materialType ];

					if ( ! material ) continue;

					if ( useBlending ) _this.setBlending( material.blending, material.blendEquation, material.blendSrc, material.blendDst );

					_this.setDepthTest( material.depthTest );
					_this.setDepthWrite( material.depthWrite );
					setPolygonOffset( material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits );

				}

				_this.renderImmediateObject( camera, lights, fog, material, object );

			}

		}

	}

	this.renderImmediateObject = function ( camera, lights, fog, material, object ) {

		var program = setProgram( camera, lights, fog, material, object );

		_currentGeometryGroupHash = - 1;

		_this.setMaterialFaces( material );

		if ( object.immediateRenderCallback ) {

			object.immediateRenderCallback( program, _gl, _frustum );

		} else {

			object.render( function ( object ) { _this.renderBufferImmediate( object, program, material ); } );

		}

	};

	function unrollImmediateBufferMaterial ( globject ) {

		var object = globject.object,
			material = object.material;

		if ( material.transparent ) {

			globject.transparent = material;
			globject.opaque = null;

		} else {

			globject.opaque = material;
			globject.transparent = null;

		}

	}

	function unrollBufferMaterial ( globject ) {

		var object = globject.object;
		var buffer = globject.buffer;

		var geometry = object.geometry;
		var material = object.material;

		if ( material instanceof THREE.MeshFaceMaterial ) {

			var materialIndex = geometry instanceof THREE.BufferGeometry ? 0 : buffer.materialIndex;

			material = material.materials[ materialIndex ];

			globject.material = material;

			if ( material.transparent ) {

				transparentObjects.push( globject );

			} else {

				opaqueObjects.push( globject );

			}

		} else if ( material ) {

			globject.material = material;

			if ( material.transparent ) {

				transparentObjects.push( globject );

			} else {

				opaqueObjects.push( globject );

			}

		}

	}

	function initObject( object, scene ) {

		if ( object.__webglInit === undefined ) {

			object.__webglInit = true;
			object._modelViewMatrix = new THREE.Matrix4();
			object._normalMatrix = new THREE.Matrix3();

			object.addEventListener( 'removed', onObjectRemoved );

		}

		var geometry = object.geometry;

		if ( geometry === undefined ) {

			// ImmediateRenderObject

		} else if ( geometry.__webglInit === undefined ) {

			geometry.__webglInit = true;
			geometry.addEventListener( 'dispose', onGeometryDispose );

			if ( geometry instanceof THREE.BufferGeometry ) {

				//

			} else if ( object instanceof THREE.Mesh ) {

				initGeometryGroups( scene, object, geometry );

			} else if ( object instanceof THREE.Line ) {

				if ( geometry.__webglVertexBuffer === undefined ) {

					createLineBuffers( geometry );
					initLineBuffers( geometry, object );

					geometry.verticesNeedUpdate = true;
					geometry.colorsNeedUpdate = true;
					geometry.lineDistancesNeedUpdate = true;

				}

			} else if ( object instanceof THREE.PointCloud ) {

				if ( geometry.__webglVertexBuffer === undefined ) {

					createParticleBuffers( geometry );
					initParticleBuffers( geometry, object );

					geometry.verticesNeedUpdate = true;
					geometry.colorsNeedUpdate = true;

				}

			}

		}

		if ( object.__webglActive === undefined) {

			object.__webglActive = true;

			if ( object instanceof THREE.Mesh ) {

				if ( geometry instanceof THREE.BufferGeometry ) {

					addBuffer( _webglObjects, geometry, object );

				} else if ( geometry instanceof THREE.Geometry ) {

					var geometryGroupsList = geometryGroups[ geometry.id ];

					for ( var i = 0,l = geometryGroupsList.length; i < l; i ++ ) {

						addBuffer( _webglObjects, geometryGroupsList[ i ], object );

					}

				}

			} else if ( object instanceof THREE.Line || object instanceof THREE.PointCloud ) {

				addBuffer( _webglObjects, geometry, object );

			} else if ( object instanceof THREE.ImmediateRenderObject || object.immediateRenderCallback ) {

				addBufferImmediate( _webglObjectsImmediate, object );

			}

		}

	}

	// Geometry splitting

	var geometryGroups = {};
	var geometryGroupCounter = 0;

	function makeGroups( geometry, usesFaceMaterial ) {

		var maxVerticesInGroup = extensions.get( 'OES_element_index_uint' ) ? 4294967296 : 65535;

		var groupHash, hash_map = {};

		var numMorphTargets = geometry.morphTargets.length;
		var numMorphNormals = geometry.morphNormals.length;

		var group;
		var groups = {};
		var groupsList = [];

		for ( var f = 0, fl = geometry.faces.length; f < fl; f ++ ) {

			var face = geometry.faces[ f ];
			var materialIndex = usesFaceMaterial ? face.materialIndex : 0;

			if ( ! ( materialIndex in hash_map ) ) {

				hash_map[ materialIndex ] = { hash: materialIndex, counter: 0 };

			}

			groupHash = hash_map[ materialIndex ].hash + '_' + hash_map[ materialIndex ].counter;

			if ( ! ( groupHash in groups ) ) {

				group = {
					id: geometryGroupCounter ++,
					faces3: [],
					materialIndex: materialIndex,
					vertices: 0,
					numMorphTargets: numMorphTargets,
					numMorphNormals: numMorphNormals
				};
				
				groups[ groupHash ] = group;
				groupsList.push( group );

			}

			if ( groups[ groupHash ].vertices + 3 > maxVerticesInGroup ) {

				hash_map[ materialIndex ].counter += 1;
				groupHash = hash_map[ materialIndex ].hash + '_' + hash_map[ materialIndex ].counter;

				if ( ! ( groupHash in groups ) ) {

					group = {
						id: geometryGroupCounter ++,
						faces3: [],
						materialIndex: materialIndex,
						vertices: 0,
						numMorphTargets: numMorphTargets,
						numMorphNormals: numMorphNormals
					};
					
					groups[ groupHash ] = group;
					groupsList.push( group );

				}

			}

			groups[ groupHash ].faces3.push( f );
			groups[ groupHash ].vertices += 3;

		}

		return groupsList;

	}

	function initGeometryGroups( scene, object, geometry ) {

		var material = object.material, addBuffers = false;

		if ( geometryGroups[ geometry.id ] === undefined || geometry.groupsNeedUpdate === true ) {

			delete _webglObjects[ object.id ];

			geometryGroups[ geometry.id ] = makeGroups( geometry, material instanceof THREE.MeshFaceMaterial );

			geometry.groupsNeedUpdate = false;

		}

		var geometryGroupsList = geometryGroups[ geometry.id ];

		// create separate VBOs per geometry chunk

		for ( var i = 0, il = geometryGroupsList.length; i < il; i ++ ) {

			var geometryGroup = geometryGroupsList[ i ];

			// initialise VBO on the first access

			if ( geometryGroup.__webglVertexBuffer === undefined ) {

				createMeshBuffers( geometryGroup );
				initMeshBuffers( geometryGroup, object );

				geometry.verticesNeedUpdate = true;
				geometry.morphTargetsNeedUpdate = true;
				geometry.elementsNeedUpdate = true;
				geometry.uvsNeedUpdate = true;
				geometry.normalsNeedUpdate = true;
				geometry.tangentsNeedUpdate = true;
				geometry.colorsNeedUpdate = true;

				addBuffers = true;

			} else {

				addBuffers = false;

			}

			if ( addBuffers || object.__webglActive === undefined ) {

				addBuffer( _webglObjects, geometryGroup, object );

			}

		}

		object.__webglActive = true;

	}

	function addBuffer( objlist, buffer, object ) {

		var id = object.id;
		objlist[id] = objlist[id] || [];
		objlist[id].push(
			{
				id: id,
				buffer: buffer,
				object: object,
				material: null,
				z: 0
			}
		);

	};

	function addBufferImmediate( objlist, object ) {

		objlist.push(
			{
				id: null,
				object: object,
				opaque: null,
				transparent: null,
				z: 0
			}
		);

	};

	// Objects updates

	function updateObject( object, scene ) {

		var geometry = object.geometry, customAttributesDirty, material;

		if ( geometry instanceof THREE.BufferGeometry ) {

			setDirectBuffers( geometry );

		} else if ( object instanceof THREE.Mesh ) {

			// check all geometry groups

			if ( geometry.groupsNeedUpdate === true ) {

				initGeometryGroups( scene, object, geometry );

			}

			var geometryGroupsList = geometryGroups[ geometry.id ];

			for ( var i = 0, il = geometryGroupsList.length; i < il; i ++ ) {

				var geometryGroup = geometryGroupsList[ i ];

				material = getBufferMaterial( object, geometryGroup );

				if ( geometry.groupsNeedUpdate === true ) {

					initMeshBuffers( geometryGroup, object );

				}

				customAttributesDirty = material.attributes && areCustomAttributesDirty( material );

				if ( geometry.verticesNeedUpdate || geometry.morphTargetsNeedUpdate || geometry.elementsNeedUpdate ||
					 geometry.uvsNeedUpdate || geometry.normalsNeedUpdate ||
					 geometry.colorsNeedUpdate || geometry.tangentsNeedUpdate || customAttributesDirty ) {

					setMeshBuffers( geometryGroup, object, _gl.DYNAMIC_DRAW, ! geometry.dynamic, material );

				}

			}

			geometry.verticesNeedUpdate = false;
			geometry.morphTargetsNeedUpdate = false;
			geometry.elementsNeedUpdate = false;
			geometry.uvsNeedUpdate = false;
			geometry.normalsNeedUpdate = false;
			geometry.colorsNeedUpdate = false;
			geometry.tangentsNeedUpdate = false;

			material.attributes && clearCustomAttributes( material );

		} else if ( object instanceof THREE.Line ) {

			material = getBufferMaterial( object, geometry );

			customAttributesDirty = material.attributes && areCustomAttributesDirty( material );

			if ( geometry.verticesNeedUpdate || geometry.colorsNeedUpdate || geometry.lineDistancesNeedUpdate || customAttributesDirty ) {

				setLineBuffers( geometry, _gl.DYNAMIC_DRAW );

			}

			geometry.verticesNeedUpdate = false;
			geometry.colorsNeedUpdate = false;
			geometry.lineDistancesNeedUpdate = false;

			material.attributes && clearCustomAttributes( material );


		} else if ( object instanceof THREE.PointCloud ) {

			material = getBufferMaterial( object, geometry );

			customAttributesDirty = material.attributes && areCustomAttributesDirty( material );

			if ( geometry.verticesNeedUpdate || geometry.colorsNeedUpdate || object.sortParticles || customAttributesDirty ) {

				setParticleBuffers( geometry, _gl.DYNAMIC_DRAW, object );

			}

			geometry.verticesNeedUpdate = false;
			geometry.colorsNeedUpdate = false;

			material.attributes && clearCustomAttributes( material );

		}

	}

	// Objects updates - custom attributes check

	function areCustomAttributesDirty( material ) {

		for ( var name in material.attributes ) {

			if ( material.attributes[ name ].needsUpdate ) return true;

		}

		return false;

	}

	function clearCustomAttributes( material ) {

		for ( var name in material.attributes ) {

			material.attributes[ name ].needsUpdate = false;

		}

	}

	// Objects removal

	function removeObject( object ) {

		if ( object instanceof THREE.Mesh  ||
			 object instanceof THREE.PointCloud ||
			 object instanceof THREE.Line ) {

			delete _webglObjects[ object.id ];

		} else if ( object instanceof THREE.ImmediateRenderObject || object.immediateRenderCallback ) {

			removeInstances( _webglObjectsImmediate, object );

		}

		delete object.__webglInit;
		delete object._modelViewMatrix;
		delete object._normalMatrix;

		delete object.__webglActive;

	}

	function removeInstances( objlist, object ) {

		for ( var o = objlist.length - 1; o >= 0; o -- ) {

			if ( objlist[ o ].object === object ) {

				objlist.splice( o, 1 );

			}

		}

	}

	// Materials

	function initMaterial( material, lights, fog, object ) {

		material.addEventListener( 'dispose', onMaterialDispose );

		var shaderID;

		if ( material instanceof THREE.MeshDepthMaterial ) {

			shaderID = 'depth';

		} else if ( material instanceof THREE.MeshNormalMaterial ) {

			shaderID = 'normal';

		} else if ( material instanceof THREE.MeshBasicMaterial ) {

			shaderID = 'basic';

		} else if ( material instanceof THREE.MeshLambertMaterial ) {

			shaderID = 'lambert';

		} else if ( material instanceof THREE.MeshPhongMaterial ) {

			shaderID = 'phong';

		} else if ( material instanceof THREE.LineBasicMaterial ) {

			shaderID = 'basic';

		} else if ( material instanceof THREE.LineDashedMaterial ) {

			shaderID = 'dashed';

		} else if ( material instanceof THREE.PointCloudMaterial ) {

			shaderID = 'particle_basic';

		}

		if ( shaderID ) {

			var shader = THREE.ShaderLib[ shaderID ];

			material.__webglShader = {
				uniforms: THREE.UniformsUtils.clone( shader.uniforms ),
				vertexShader: shader.vertexShader,
				fragmentShader: shader.fragmentShader
			}

		} else {

			material.__webglShader = {
				uniforms: material.uniforms,
				vertexShader: material.vertexShader,
				fragmentShader: material.fragmentShader
			}

		}

		// heuristics to create shader parameters according to lights in the scene
		// (not to blow over maxLights budget)

		var maxLightCount = allocateLights( lights );
		var maxShadows = allocateShadows( lights );
		var maxBones = allocateBones( object );

		var parameters = {

			precision: _precision,
			supportsVertexTextures: _supportsVertexTextures,

			map: !! material.map,
			envMap: !! material.envMap,
			lightMap: !! material.lightMap,
			bumpMap: !! material.bumpMap,
			normalMap: !! material.normalMap,
			specularMap: !! material.specularMap,
			alphaMap: !! material.alphaMap,

			vertexColors: material.vertexColors,

			fog: fog,
			useFog: material.fog,
			fogExp: fog instanceof THREE.FogExp2,

			sizeAttenuation: material.sizeAttenuation,
			logarithmicDepthBuffer: _logarithmicDepthBuffer,

			skinning: material.skinning,
			maxBones: maxBones,
			useVertexTexture: _supportsBoneTextures && object && object.skeleton && object.skeleton.useVertexTexture,

			morphTargets: material.morphTargets,
			morphNormals: material.morphNormals,
			maxMorphTargets: _this.maxMorphTargets,
			maxMorphNormals: _this.maxMorphNormals,

			maxDirLights: maxLightCount.directional,
			maxPointLights: maxLightCount.point,
			maxSpotLights: maxLightCount.spot,
			maxHemiLights: maxLightCount.hemi,

			maxShadows: maxShadows,
			shadowMapEnabled: _this.shadowMapEnabled && object.receiveShadow && maxShadows > 0,
			shadowMapType: _this.shadowMapType,
			shadowMapDebug: _this.shadowMapDebug,
			shadowMapCascade: _this.shadowMapCascade,

			alphaTest: material.alphaTest,
			metal: material.metal,
			wrapAround: material.wrapAround,
			doubleSided: material.side === THREE.DoubleSide,
			flipSided: material.side === THREE.BackSide

		};

		// Generate code

		var chunks = [];

		if ( shaderID ) {

			chunks.push( shaderID );

		} else {

			chunks.push( material.fragmentShader );
			chunks.push( material.vertexShader );

		}

		if ( material.defines !== undefined ) {

			for ( var name in material.defines ) {

				chunks.push( name );
				chunks.push( material.defines[ name ] );

			}

		}

		for ( var name in parameters ) {

			chunks.push( name );
			chunks.push( parameters[ name ] );

		}

		var code = chunks.join();

		var program;

		// Check if code has been already compiled

		for ( var p = 0, pl = _programs.length; p < pl; p ++ ) {

			var programInfo = _programs[ p ];

			if ( programInfo.code === code ) {

				program = programInfo;
				program.usedTimes ++;

				break;

			}

		}

		if ( program === undefined ) {

			program = new THREE.WebGLProgram( _this, code, material, parameters );
			_programs.push( program );

			_this.info.memory.programs = _programs.length;

		}

		material.program = program;

		var attributes = program.attributes;

		if ( material.morphTargets ) {

			material.numSupportedMorphTargets = 0;

			var id, base = 'morphTarget';

			for ( var i = 0; i < _this.maxMorphTargets; i ++ ) {

				id = base + i;

				if ( attributes[ id ] >= 0 ) {

					material.numSupportedMorphTargets ++;

				}

			}

		}

		if ( material.morphNormals ) {

			material.numSupportedMorphNormals = 0;

			var id, base = 'morphNormal';

			for ( i = 0; i < _this.maxMorphNormals; i ++ ) {

				id = base + i;

				if ( attributes[ id ] >= 0 ) {

					material.numSupportedMorphNormals ++;

				}

			}

		}

		material.uniformsList = [];

		for ( var u in material.__webglShader.uniforms ) {

			var location = material.program.uniforms[ u ];

			if ( location ) {
				material.uniformsList.push( [ material.__webglShader.uniforms[ u ], location ] );
			}

		}

	}

	function setProgram( camera, lights, fog, material, object ) {

		_usedTextureUnits = 0;

		if ( material.needsUpdate ) {

			if ( material.program ) deallocateMaterial( material );

			initMaterial( material, lights, fog, object );
			material.needsUpdate = false;

		}

		if ( material.morphTargets ) {

			if ( ! object.__webglMorphTargetInfluences ) {

				object.__webglMorphTargetInfluences = new Float32Array( _this.maxMorphTargets );

			}

		}

		var refreshProgram = false;
		var refreshMaterial = false;
		var refreshLights = false;

		var program = material.program,
			p_uniforms = program.uniforms,
			m_uniforms = material.__webglShader.uniforms;

		if ( program.id !== _currentProgram ) {

			_gl.useProgram( program.program );
			_currentProgram = program.id;

			refreshProgram = true;
			refreshMaterial = true;
			refreshLights = true;

		}

		if ( material.id !== _currentMaterialId ) {

			if ( _currentMaterialId === -1 ) refreshLights = true;
			_currentMaterialId = material.id;

			refreshMaterial = true;

		}

		if ( refreshProgram || camera !== _currentCamera ) {

			_gl.uniformMatrix4fv( p_uniforms.projectionMatrix, false, camera.projectionMatrix.elements );

			if ( _logarithmicDepthBuffer ) {

				_gl.uniform1f( p_uniforms.logDepthBufFC, 2.0 / ( Math.log( camera.far + 1.0 ) / Math.LN2 ) );

			}


			if ( camera !== _currentCamera ) _currentCamera = camera;

			// load material specific uniforms
			// (shader material also gets them for the sake of genericity)

			if ( material instanceof THREE.ShaderMaterial ||
				 material instanceof THREE.MeshPhongMaterial ||
				 material.envMap ) {

				if ( p_uniforms.cameraPosition !== null ) {

					_vector3.setFromMatrixPosition( camera.matrixWorld );
					_gl.uniform3f( p_uniforms.cameraPosition, _vector3.x, _vector3.y, _vector3.z );

				}

			}

			if ( material instanceof THREE.MeshPhongMaterial ||
				 material instanceof THREE.MeshLambertMaterial ||
				 material instanceof THREE.ShaderMaterial ||
				 material.skinning ) {

				if ( p_uniforms.viewMatrix !== null ) {

					_gl.uniformMatrix4fv( p_uniforms.viewMatrix, false, camera.matrixWorldInverse.elements );

				}

			}

		}

		// skinning uniforms must be set even if material didn't change
		// auto-setting of texture unit for bone texture must go before other textures
		// not sure why, but otherwise weird things happen

		if ( material.skinning ) {

			if ( object.bindMatrix && p_uniforms.bindMatrix !== null ) {

				_gl.uniformMatrix4fv( p_uniforms.bindMatrix, false, object.bindMatrix.elements );

			}

			if ( object.bindMatrixInverse && p_uniforms.bindMatrixInverse !== null ) {

				_gl.uniformMatrix4fv( p_uniforms.bindMatrixInverse, false, object.bindMatrixInverse.elements );

			}

			if ( _supportsBoneTextures && object.skeleton && object.skeleton.useVertexTexture ) {

				if ( p_uniforms.boneTexture !== null ) {

					var textureUnit = getTextureUnit();

					_gl.uniform1i( p_uniforms.boneTexture, textureUnit );
					_this.setTexture( object.skeleton.boneTexture, textureUnit );

				}

				if ( p_uniforms.boneTextureWidth !== null ) {

					_gl.uniform1i( p_uniforms.boneTextureWidth, object.skeleton.boneTextureWidth );

				}

				if ( p_uniforms.boneTextureHeight !== null ) {

					_gl.uniform1i( p_uniforms.boneTextureHeight, object.skeleton.boneTextureHeight );

				}

			} else if ( object.skeleton && object.skeleton.boneMatrices ) {

				if ( p_uniforms.boneGlobalMatrices !== null ) {

					_gl.uniformMatrix4fv( p_uniforms.boneGlobalMatrices, false, object.skeleton.boneMatrices );

				}

			}

		}

		if ( refreshMaterial ) {

			// refresh uniforms common to several materials

			if ( fog && material.fog ) {

				refreshUniformsFog( m_uniforms, fog );

			}

			if ( material instanceof THREE.MeshPhongMaterial ||
				 material instanceof THREE.MeshLambertMaterial ||
				 material.lights ) {

				if ( _lightsNeedUpdate ) {

					refreshLights = true;
					setupLights( lights );
					_lightsNeedUpdate = false;
				}

				if ( refreshLights ) {
					refreshUniformsLights( m_uniforms, _lights );
					markUniformsLightsNeedsUpdate( m_uniforms, true );
				} else {
					markUniformsLightsNeedsUpdate( m_uniforms, false );
				}

			}

			if ( material instanceof THREE.MeshBasicMaterial ||
				 material instanceof THREE.MeshLambertMaterial ||
				 material instanceof THREE.MeshPhongMaterial ) {

				refreshUniformsCommon( m_uniforms, material );

			}

			// refresh single material specific uniforms

			if ( material instanceof THREE.LineBasicMaterial ) {

				refreshUniformsLine( m_uniforms, material );

			} else if ( material instanceof THREE.LineDashedMaterial ) {

				refreshUniformsLine( m_uniforms, material );
				refreshUniformsDash( m_uniforms, material );

			} else if ( material instanceof THREE.PointCloudMaterial ) {

				refreshUniformsParticle( m_uniforms, material );

			} else if ( material instanceof THREE.MeshPhongMaterial ) {

				refreshUniformsPhong( m_uniforms, material );

			} else if ( material instanceof THREE.MeshLambertMaterial ) {

				refreshUniformsLambert( m_uniforms, material );

			} else if ( material instanceof THREE.MeshDepthMaterial ) {

				m_uniforms.mNear.value = camera.near;
				m_uniforms.mFar.value = camera.far;
				m_uniforms.opacity.value = material.opacity;

			} else if ( material instanceof THREE.MeshNormalMaterial ) {

				m_uniforms.opacity.value = material.opacity;

			}

			if ( object.receiveShadow && ! material._shadowPass ) {

				refreshUniformsShadow( m_uniforms, lights );

			}

			// load common uniforms

			loadUniformsGeneric( material.uniformsList );

		}

		loadUniformsMatrices( p_uniforms, object );

		if ( p_uniforms.modelMatrix !== null ) {

			_gl.uniformMatrix4fv( p_uniforms.modelMatrix, false, object.matrixWorld.elements );

		}

		return program;

	}

	// Uniforms (refresh uniforms objects)

	function refreshUniformsCommon ( uniforms, material ) {

		uniforms.opacity.value = material.opacity;

		if ( _this.gammaInput ) {

			uniforms.diffuse.value.copyGammaToLinear( material.color );

		} else {

			uniforms.diffuse.value = material.color;

		}

		uniforms.map.value = material.map;
		uniforms.lightMap.value = material.lightMap;
		uniforms.specularMap.value = material.specularMap;
		uniforms.alphaMap.value = material.alphaMap;

		if ( material.bumpMap ) {

			uniforms.bumpMap.value = material.bumpMap;
			uniforms.bumpScale.value = material.bumpScale;

		}

		if ( material.normalMap ) {

			uniforms.normalMap.value = material.normalMap;
			uniforms.normalScale.value.copy( material.normalScale );

		}

		// uv repeat and offset setting priorities
		//  1. color map
		//  2. specular map
		//  3. normal map
		//  4. bump map
		//  5. alpha map

		var uvScaleMap;

		if ( material.map ) {

			uvScaleMap = material.map;

		} else if ( material.specularMap ) {

			uvScaleMap = material.specularMap;

		} else if ( material.normalMap ) {

			uvScaleMap = material.normalMap;

		} else if ( material.bumpMap ) {

			uvScaleMap = material.bumpMap;

		} else if ( material.alphaMap ) {

			uvScaleMap = material.alphaMap;

		}

		if ( uvScaleMap !== undefined ) {

			var offset = uvScaleMap.offset;
			var repeat = uvScaleMap.repeat;

			uniforms.offsetRepeat.value.set( offset.x, offset.y, repeat.x, repeat.y );

		}

		uniforms.envMap.value = material.envMap;
		uniforms.flipEnvMap.value = ( material.envMap instanceof THREE.WebGLRenderTargetCube ) ? 1 : - 1;

		if ( _this.gammaInput ) {

			//uniforms.reflectivity.value = material.reflectivity * material.reflectivity;
			uniforms.reflectivity.value = material.reflectivity;

		} else {

			uniforms.reflectivity.value = material.reflectivity;

		}

		uniforms.refractionRatio.value = material.refractionRatio;
		uniforms.combine.value = material.combine;
		uniforms.useRefract.value = material.envMap && material.envMap.mapping instanceof THREE.CubeRefractionMapping;

	}

	function refreshUniformsLine ( uniforms, material ) {

		uniforms.diffuse.value = material.color;
		uniforms.opacity.value = material.opacity;

	}

	function refreshUniformsDash ( uniforms, material ) {

		uniforms.dashSize.value = material.dashSize;
		uniforms.totalSize.value = material.dashSize + material.gapSize;
		uniforms.scale.value = material.scale;

	}

	function refreshUniformsParticle ( uniforms, material ) {

		uniforms.psColor.value = material.color;
		uniforms.opacity.value = material.opacity;
		uniforms.size.value = material.size;
		uniforms.scale.value = _canvas.height / 2.0; // TODO: Cache this.

		uniforms.map.value = material.map;

	}

	function refreshUniformsFog ( uniforms, fog ) {

		uniforms.fogColor.value = fog.color;

		if ( fog instanceof THREE.Fog ) {

			uniforms.fogNear.value = fog.near;
			uniforms.fogFar.value = fog.far;

		} else if ( fog instanceof THREE.FogExp2 ) {

			uniforms.fogDensity.value = fog.density;

		}

	}

	function refreshUniformsPhong ( uniforms, material ) {

		uniforms.shininess.value = material.shininess;

		if ( _this.gammaInput ) {

			uniforms.ambient.value.copyGammaToLinear( material.ambient );
			uniforms.emissive.value.copyGammaToLinear( material.emissive );
			uniforms.specular.value.copyGammaToLinear( material.specular );

		} else {

			uniforms.ambient.value = material.ambient;
			uniforms.emissive.value = material.emissive;
			uniforms.specular.value = material.specular;

		}

		if ( material.wrapAround ) {

			uniforms.wrapRGB.value.copy( material.wrapRGB );

		}

	}

	function refreshUniformsLambert ( uniforms, material ) {

		if ( _this.gammaInput ) {

			uniforms.ambient.value.copyGammaToLinear( material.ambient );
			uniforms.emissive.value.copyGammaToLinear( material.emissive );

		} else {

			uniforms.ambient.value = material.ambient;
			uniforms.emissive.value = material.emissive;

		}

		if ( material.wrapAround ) {

			uniforms.wrapRGB.value.copy( material.wrapRGB );

		}

	}

	function refreshUniformsLights ( uniforms, lights ) {

		uniforms.ambientLightColor.value = lights.ambient;

		uniforms.directionalLightColor.value = lights.directional.colors;
		uniforms.directionalLightDirection.value = lights.directional.positions;

		uniforms.pointLightColor.value = lights.point.colors;
		uniforms.pointLightPosition.value = lights.point.positions;
		uniforms.pointLightDistance.value = lights.point.distances;

		uniforms.spotLightColor.value = lights.spot.colors;
		uniforms.spotLightPosition.value = lights.spot.positions;
		uniforms.spotLightDistance.value = lights.spot.distances;
		uniforms.spotLightDirection.value = lights.spot.directions;
		uniforms.spotLightAngleCos.value = lights.spot.anglesCos;
		uniforms.spotLightExponent.value = lights.spot.exponents;

		uniforms.hemisphereLightSkyColor.value = lights.hemi.skyColors;
		uniforms.hemisphereLightGroundColor.value = lights.hemi.groundColors;
		uniforms.hemisphereLightDirection.value = lights.hemi.positions;

	}

	// If uniforms are marked as clean, they don't need to be loaded to the GPU.

	function markUniformsLightsNeedsUpdate ( uniforms, boolean ) {

		uniforms.ambientLightColor.needsUpdate = boolean;

		uniforms.directionalLightColor.needsUpdate = boolean;
		uniforms.directionalLightDirection.needsUpdate = boolean;

		uniforms.pointLightColor.needsUpdate = boolean;
		uniforms.pointLightPosition.needsUpdate = boolean;
		uniforms.pointLightDistance.needsUpdate = boolean;

		uniforms.spotLightColor.needsUpdate = boolean;
		uniforms.spotLightPosition.needsUpdate = boolean;
		uniforms.spotLightDistance.needsUpdate = boolean;
		uniforms.spotLightDirection.needsUpdate = boolean;
		uniforms.spotLightAngleCos.needsUpdate = boolean;
		uniforms.spotLightExponent.needsUpdate = boolean;

		uniforms.hemisphereLightSkyColor.needsUpdate = boolean;
		uniforms.hemisphereLightGroundColor.needsUpdate = boolean;
		uniforms.hemisphereLightDirection.needsUpdate = boolean;

	}

	function refreshUniformsShadow ( uniforms, lights ) {

		if ( uniforms.shadowMatrix ) {

			var j = 0;

			for ( var i = 0, il = lights.length; i < il; i ++ ) {

				var light = lights[ i ];

				if ( ! light.castShadow ) continue;

				if ( light instanceof THREE.SpotLight || ( light instanceof THREE.DirectionalLight && ! light.shadowCascade ) ) {

					uniforms.shadowMap.value[ j ] = light.shadowMap;
					uniforms.shadowMapSize.value[ j ] = light.shadowMapSize;

					uniforms.shadowMatrix.value[ j ] = light.shadowMatrix;

					uniforms.shadowDarkness.value[ j ] = light.shadowDarkness;
					uniforms.shadowBias.value[ j ] = light.shadowBias;

					j ++;

				}

			}

		}

	}

	// Uniforms (load to GPU)

	function loadUniformsMatrices ( uniforms, object ) {

		_gl.uniformMatrix4fv( uniforms.modelViewMatrix, false, object._modelViewMatrix.elements );

		if ( uniforms.normalMatrix ) {

			_gl.uniformMatrix3fv( uniforms.normalMatrix, false, object._normalMatrix.elements );

		}

	}

	function getTextureUnit() {

		var textureUnit = _usedTextureUnits;

		if ( textureUnit >= _maxTextures ) {

			console.warn( 'WebGLRenderer: trying to use ' + textureUnit + ' texture units while this GPU supports only ' + _maxTextures );

		}

		_usedTextureUnits += 1;

		return textureUnit;

	}

	function loadUniformsGeneric ( uniforms ) {

		var texture, textureUnit, offset;

		for ( var j = 0, jl = uniforms.length; j < jl; j ++ ) {

			var uniform = uniforms[ j ][ 0 ];

			// needsUpdate property is not added to all uniforms.
			if ( uniform.needsUpdate === false ) continue;

			var type = uniform.type;
			var value = uniform.value;
			var location = uniforms[ j ][ 1 ];

			switch ( type ) {

				case '1i':
					_gl.uniform1i( location, value );
					break;

				case '1f':
					_gl.uniform1f( location, value );
					break;

				case '2f':
					_gl.uniform2f( location, value[ 0 ], value[ 1 ] );
					break;

				case '3f':
					_gl.uniform3f( location, value[ 0 ], value[ 1 ], value[ 2 ] );
					break;

				case '4f':
					_gl.uniform4f( location, value[ 0 ], value[ 1 ], value[ 2 ], value[ 3 ] );
					break;

				case '1iv':
					_gl.uniform1iv( location, value );
					break;

				case '3iv':
					_gl.uniform3iv( location, value );
					break;

				case '1fv':
					_gl.uniform1fv( location, value );
					break;

				case '2fv':
					_gl.uniform2fv( location, value );
					break;

				case '3fv':
					_gl.uniform3fv( location, value );
					break;

				case '4fv':
					_gl.uniform4fv( location, value );
					break;

				case 'Matrix3fv':
					_gl.uniformMatrix3fv( location, false, value );
					break;

				case 'Matrix4fv':
					_gl.uniformMatrix4fv( location, false, value );
					break;

				//

				case 'i':

					// single integer
					_gl.uniform1i( location, value );

					break;

				case 'f':

					// single float
					_gl.uniform1f( location, value );

					break;

				case 'v2':

					// single THREE.Vector2
					_gl.uniform2f( location, value.x, value.y );

					break;

				case 'v3':

					// single THREE.Vector3
					_gl.uniform3f( location, value.x, value.y, value.z );

					break;

				case 'v4':

					// single THREE.Vector4
					_gl.uniform4f( location, value.x, value.y, value.z, value.w );

					break;

				case 'c':

					// single THREE.Color
					_gl.uniform3f( location, value.r, value.g, value.b );

					break;

				case 'iv1':

					// flat array of integers (JS or typed array)
					_gl.uniform1iv( location, value );

					break;

				case 'iv':

					// flat array of integers with 3 x N size (JS or typed array)
					_gl.uniform3iv( location, value );

					break;

				case 'fv1':

					// flat array of floats (JS or typed array)
					_gl.uniform1fv( location, value );

					break;

				case 'fv':

					// flat array of floats with 3 x N size (JS or typed array)
					_gl.uniform3fv( location, value );

					break;

				case 'v2v':

					// array of THREE.Vector2

					if ( uniform._array === undefined ) {

						uniform._array = new Float32Array( 2 * value.length );

					}

					for ( var i = 0, il = value.length; i < il; i ++ ) {

						offset = i * 2;

						uniform._array[ offset ]   = value[ i ].x;
						uniform._array[ offset + 1 ] = value[ i ].y;

					}

					_gl.uniform2fv( location, uniform._array );

					break;

				case 'v3v':

					// array of THREE.Vector3

					if ( uniform._array === undefined ) {

						uniform._array = new Float32Array( 3 * value.length );

					}

					for ( var i = 0, il = value.length; i < il; i ++ ) {

						offset = i * 3;

						uniform._array[ offset ]   = value[ i ].x;
						uniform._array[ offset + 1 ] = value[ i ].y;
						uniform._array[ offset + 2 ] = value[ i ].z;

					}

					_gl.uniform3fv( location, uniform._array );

					break;

				case 'v4v':

					// array of THREE.Vector4

					if ( uniform._array === undefined ) {

						uniform._array = new Float32Array( 4 * value.length );

					}

					for ( var i = 0, il = value.length; i < il; i ++ ) {

						offset = i * 4;

						uniform._array[ offset ]   = value[ i ].x;
						uniform._array[ offset + 1 ] = value[ i ].y;
						uniform._array[ offset + 2 ] = value[ i ].z;
						uniform._array[ offset + 3 ] = value[ i ].w;

					}

					_gl.uniform4fv( location, uniform._array );

					break;

				case 'm3':

					// single THREE.Matrix3
					_gl.uniformMatrix3fv( location, false, value.elements );

					break;

				case 'm3v':

					// array of THREE.Matrix3

					if ( uniform._array === undefined ) {

						uniform._array = new Float32Array( 9 * value.length );

					}

					for ( var i = 0, il = value.length; i < il; i ++ ) {

						value[ i ].flattenToArrayOffset( uniform._array, i * 9 );

					}

					_gl.uniformMatrix3fv( location, false, uniform._array );

					break;

				case 'm4':

					// single THREE.Matrix4
					_gl.uniformMatrix4fv( location, false, value.elements );

					break;

				case 'm4v':

					// array of THREE.Matrix4

					if ( uniform._array === undefined ) {

						uniform._array = new Float32Array( 16 * value.length );

					}

					for ( var i = 0, il = value.length; i < il; i ++ ) {

						value[ i ].flattenToArrayOffset( uniform._array, i * 16 );

					}

					_gl.uniformMatrix4fv( location, false, uniform._array );

					break;

				case 't':

					// single THREE.Texture (2d or cube)

					texture = value;
					textureUnit = getTextureUnit();

					_gl.uniform1i( location, textureUnit );

					if ( ! texture ) continue;

					if ( texture instanceof THREE.CubeTexture ||
					   ( texture.image instanceof Array && texture.image.length === 6 ) ) { // CompressedTexture can have Array in image :/

						setCubeTexture( texture, textureUnit );

					} else if ( texture instanceof THREE.WebGLRenderTargetCube ) {

						setCubeTextureDynamic( texture, textureUnit );

					} else {

						_this.setTexture( texture, textureUnit );

					}

					break;

				case 'tv':

					// array of THREE.Texture (2d)

					if ( uniform._array === undefined ) {

						uniform._array = [];

					}

					for ( var i = 0, il = uniform.value.length; i < il; i ++ ) {

						uniform._array[ i ] = getTextureUnit();

					}

					_gl.uniform1iv( location, uniform._array );

					for ( var i = 0, il = uniform.value.length; i < il; i ++ ) {

						texture = uniform.value[ i ];
						textureUnit = uniform._array[ i ];

						if ( ! texture ) continue;

						_this.setTexture( texture, textureUnit );

					}

					break;

				default:

					console.warn( 'THREE.WebGLRenderer: Unknown uniform type: ' + type );

			}

		}

	}

	function setupMatrices ( object, camera ) {

		object._modelViewMatrix.multiplyMatrices( camera.matrixWorldInverse, object.matrixWorld );
		object._normalMatrix.getNormalMatrix( object._modelViewMatrix );

	}

	//

	function setColorGamma( array, offset, color, intensitySq ) {

		array[ offset ]     = color.r * color.r * intensitySq;
		array[ offset + 1 ] = color.g * color.g * intensitySq;
		array[ offset + 2 ] = color.b * color.b * intensitySq;

	}

	function setColorLinear( array, offset, color, intensity ) {

		array[ offset ]     = color.r * intensity;
		array[ offset + 1 ] = color.g * intensity;
		array[ offset + 2 ] = color.b * intensity;

	}

	function setupLights ( lights ) {

		var l, ll, light, n,
		r = 0, g = 0, b = 0,
		color, skyColor, groundColor,
		intensity,  intensitySq,
		position,
		distance,

		zlights = _lights,

		dirColors = zlights.directional.colors,
		dirPositions = zlights.directional.positions,

		pointColors = zlights.point.colors,
		pointPositions = zlights.point.positions,
		pointDistances = zlights.point.distances,

		spotColors = zlights.spot.colors,
		spotPositions = zlights.spot.positions,
		spotDistances = zlights.spot.distances,
		spotDirections = zlights.spot.directions,
		spotAnglesCos = zlights.spot.anglesCos,
		spotExponents = zlights.spot.exponents,

		hemiSkyColors = zlights.hemi.skyColors,
		hemiGroundColors = zlights.hemi.groundColors,
		hemiPositions = zlights.hemi.positions,

		dirLength = 0,
		pointLength = 0,
		spotLength = 0,
		hemiLength = 0,

		dirCount = 0,
		pointCount = 0,
		spotCount = 0,
		hemiCount = 0,

		dirOffset = 0,
		pointOffset = 0,
		spotOffset = 0,
		hemiOffset = 0;

		for ( l = 0, ll = lights.length; l < ll; l ++ ) {

			light = lights[ l ];

			if ( light.onlyShadow ) continue;

			color = light.color;
			intensity = light.intensity;
			distance = light.distance;

			if ( light instanceof THREE.AmbientLight ) {

				if ( ! light.visible ) continue;

				if ( _this.gammaInput ) {

					r += color.r * color.r;
					g += color.g * color.g;
					b += color.b * color.b;

				} else {

					r += color.r;
					g += color.g;
					b += color.b;

				}

			} else if ( light instanceof THREE.DirectionalLight ) {

				dirCount += 1;

				if ( ! light.visible ) continue;

				_direction.setFromMatrixPosition( light.matrixWorld );
				_vector3.setFromMatrixPosition( light.target.matrixWorld );
				_direction.sub( _vector3 );
				_direction.normalize();

				dirOffset = dirLength * 3;

				dirPositions[ dirOffset ]     = _direction.x;
				dirPositions[ dirOffset + 1 ] = _direction.y;
				dirPositions[ dirOffset + 2 ] = _direction.z;

				if ( _this.gammaInput ) {

					setColorGamma( dirColors, dirOffset, color, intensity * intensity );

				} else {

					setColorLinear( dirColors, dirOffset, color, intensity );

				}

				dirLength += 1;

			} else if ( light instanceof THREE.PointLight ) {

				pointCount += 1;

				if ( ! light.visible ) continue;

				pointOffset = pointLength * 3;

				if ( _this.gammaInput ) {

					setColorGamma( pointColors, pointOffset, color, intensity * intensity );

				} else {

					setColorLinear( pointColors, pointOffset, color, intensity );

				}

				_vector3.setFromMatrixPosition( light.matrixWorld );

				pointPositions[ pointOffset ]     = _vector3.x;
				pointPositions[ pointOffset + 1 ] = _vector3.y;
				pointPositions[ pointOffset + 2 ] = _vector3.z;

				pointDistances[ pointLength ] = distance;

				pointLength += 1;

			} else if ( light instanceof THREE.SpotLight ) {

				spotCount += 1;

				if ( ! light.visible ) continue;

				spotOffset = spotLength * 3;

				if ( _this.gammaInput ) {

					setColorGamma( spotColors, spotOffset, color, intensity * intensity );

				} else {

					setColorLinear( spotColors, spotOffset, color, intensity );

				}

				_direction.setFromMatrixPosition( light.matrixWorld );

				spotPositions[ spotOffset ]     = _direction.x;
				spotPositions[ spotOffset + 1 ] = _direction.y;
				spotPositions[ spotOffset + 2 ] = _direction.z;

				spotDistances[ spotLength ] = distance;

				_vector3.setFromMatrixPosition( light.target.matrixWorld );
				_direction.sub( _vector3 );
				_direction.normalize();

				spotDirections[ spotOffset ]     = _direction.x;
				spotDirections[ spotOffset + 1 ] = _direction.y;
				spotDirections[ spotOffset + 2 ] = _direction.z;

				spotAnglesCos[ spotLength ] = Math.cos( light.angle );
				spotExponents[ spotLength ] = light.exponent;

				spotLength += 1;

			} else if ( light instanceof THREE.HemisphereLight ) {

				hemiCount += 1;

				if ( ! light.visible ) continue;

				_direction.setFromMatrixPosition( light.matrixWorld );
				_direction.normalize();

				hemiOffset = hemiLength * 3;

				hemiPositions[ hemiOffset ]     = _direction.x;
				hemiPositions[ hemiOffset + 1 ] = _direction.y;
				hemiPositions[ hemiOffset + 2 ] = _direction.z;

				skyColor = light.color;
				groundColor = light.groundColor;

				if ( _this.gammaInput ) {

					intensitySq = intensity * intensity;

					setColorGamma( hemiSkyColors, hemiOffset, skyColor, intensitySq );
					setColorGamma( hemiGroundColors, hemiOffset, groundColor, intensitySq );

				} else {

					setColorLinear( hemiSkyColors, hemiOffset, skyColor, intensity );
					setColorLinear( hemiGroundColors, hemiOffset, groundColor, intensity );

				}

				hemiLength += 1;

			}

		}

		// null eventual remains from removed lights
		// (this is to avoid if in shader)

		for ( l = dirLength * 3, ll = Math.max( dirColors.length, dirCount * 3 ); l < ll; l ++ ) dirColors[ l ] = 0.0;
		for ( l = pointLength * 3, ll = Math.max( pointColors.length, pointCount * 3 ); l < ll; l ++ ) pointColors[ l ] = 0.0;
		for ( l = spotLength * 3, ll = Math.max( spotColors.length, spotCount * 3 ); l < ll; l ++ ) spotColors[ l ] = 0.0;
		for ( l = hemiLength * 3, ll = Math.max( hemiSkyColors.length, hemiCount * 3 ); l < ll; l ++ ) hemiSkyColors[ l ] = 0.0;
		for ( l = hemiLength * 3, ll = Math.max( hemiGroundColors.length, hemiCount * 3 ); l < ll; l ++ ) hemiGroundColors[ l ] = 0.0;

		zlights.directional.length = dirLength;
		zlights.point.length = pointLength;
		zlights.spot.length = spotLength;
		zlights.hemi.length = hemiLength;

		zlights.ambient[ 0 ] = r;
		zlights.ambient[ 1 ] = g;
		zlights.ambient[ 2 ] = b;

	}

	// GL state setting

	this.setFaceCulling = function ( cullFace, frontFaceDirection ) {

		if ( cullFace === THREE.CullFaceNone ) {

			_gl.disable( _gl.CULL_FACE );

		} else {

			if ( frontFaceDirection === THREE.FrontFaceDirectionCW ) {

				_gl.frontFace( _gl.CW );

			} else {

				_gl.frontFace( _gl.CCW );

			}

			if ( cullFace === THREE.CullFaceBack ) {

				_gl.cullFace( _gl.BACK );

			} else if ( cullFace === THREE.CullFaceFront ) {

				_gl.cullFace( _gl.FRONT );

			} else {

				_gl.cullFace( _gl.FRONT_AND_BACK );

			}

			_gl.enable( _gl.CULL_FACE );

		}

	};

	this.setMaterialFaces = function ( material ) {

		var doubleSided = material.side === THREE.DoubleSide;
		var flipSided = material.side === THREE.BackSide;

		if ( _oldDoubleSided !== doubleSided ) {

			if ( doubleSided ) {

				_gl.disable( _gl.CULL_FACE );

			} else {

				_gl.enable( _gl.CULL_FACE );

			}

			_oldDoubleSided = doubleSided;

		}

		if ( _oldFlipSided !== flipSided ) {

			if ( flipSided ) {

				_gl.frontFace( _gl.CW );

			} else {

				_gl.frontFace( _gl.CCW );

			}

			_oldFlipSided = flipSided;

		}

	};

	this.setDepthTest = function ( depthTest ) {

		if ( _oldDepthTest !== depthTest ) {

			if ( depthTest ) {

				_gl.enable( _gl.DEPTH_TEST );

			} else {

				_gl.disable( _gl.DEPTH_TEST );

			}

			_oldDepthTest = depthTest;

		}

	};

	this.setDepthWrite = function ( depthWrite ) {

		if ( _oldDepthWrite !== depthWrite ) {

			_gl.depthMask( depthWrite );
			_oldDepthWrite = depthWrite;

		}

	};

	function setLineWidth ( width ) {

		if ( width !== _oldLineWidth ) {

			_gl.lineWidth( width );

			_oldLineWidth = width;

		}

	}

	function setPolygonOffset ( polygonoffset, factor, units ) {

		if ( _oldPolygonOffset !== polygonoffset ) {

			if ( polygonoffset ) {

				_gl.enable( _gl.POLYGON_OFFSET_FILL );

			} else {

				_gl.disable( _gl.POLYGON_OFFSET_FILL );

			}

			_oldPolygonOffset = polygonoffset;

		}

		if ( polygonoffset && ( _oldPolygonOffsetFactor !== factor || _oldPolygonOffsetUnits !== units ) ) {

			_gl.polygonOffset( factor, units );

			_oldPolygonOffsetFactor = factor;
			_oldPolygonOffsetUnits = units;

		}

	}

	this.setBlending = function ( blending, blendEquation, blendSrc, blendDst ) {

		if ( blending !== _oldBlending ) {

			if ( blending === THREE.NoBlending ) {

				_gl.disable( _gl.BLEND );

			} else if ( blending === THREE.AdditiveBlending ) {

				_gl.enable( _gl.BLEND );
				_gl.blendEquation( _gl.FUNC_ADD );
				_gl.blendFunc( _gl.SRC_ALPHA, _gl.ONE );

			} else if ( blending === THREE.SubtractiveBlending ) {

				// TODO: Find blendFuncSeparate() combination
				_gl.enable( _gl.BLEND );
				_gl.blendEquation( _gl.FUNC_ADD );
				_gl.blendFunc( _gl.ZERO, _gl.ONE_MINUS_SRC_COLOR );

			} else if ( blending === THREE.MultiplyBlending ) {

				// TODO: Find blendFuncSeparate() combination
				_gl.enable( _gl.BLEND );
				_gl.blendEquation( _gl.FUNC_ADD );
				_gl.blendFunc( _gl.ZERO, _gl.SRC_COLOR );

			} else if ( blending === THREE.CustomBlending ) {

				_gl.enable( _gl.BLEND );

			} else {

				_gl.enable( _gl.BLEND );
				_gl.blendEquationSeparate( _gl.FUNC_ADD, _gl.FUNC_ADD );
				_gl.blendFuncSeparate( _gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA, _gl.ONE, _gl.ONE_MINUS_SRC_ALPHA );

			}

			_oldBlending = blending;

		}

		if ( blending === THREE.CustomBlending ) {

			if ( blendEquation !== _oldBlendEquation ) {

				_gl.blendEquation( paramThreeToGL( blendEquation ) );

				_oldBlendEquation = blendEquation;

			}

			if ( blendSrc !== _oldBlendSrc || blendDst !== _oldBlendDst ) {

				_gl.blendFunc( paramThreeToGL( blendSrc ), paramThreeToGL( blendDst ) );

				_oldBlendSrc = blendSrc;
				_oldBlendDst = blendDst;

			}

		} else {

			_oldBlendEquation = null;
			_oldBlendSrc = null;
			_oldBlendDst = null;

		}

	};

	// Textures

	function setTextureParameters ( textureType, texture, isImagePowerOfTwo ) {

		var extension;

		if ( isImagePowerOfTwo ) {

			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_S, paramThreeToGL( texture.wrapS ) );
			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_T, paramThreeToGL( texture.wrapT ) );

			_gl.texParameteri( textureType, _gl.TEXTURE_MAG_FILTER, paramThreeToGL( texture.magFilter ) );
			_gl.texParameteri( textureType, _gl.TEXTURE_MIN_FILTER, paramThreeToGL( texture.minFilter ) );

		} else {

			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE );
			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE );

			_gl.texParameteri( textureType, _gl.TEXTURE_MAG_FILTER, filterFallback( texture.magFilter ) );
			_gl.texParameteri( textureType, _gl.TEXTURE_MIN_FILTER, filterFallback( texture.minFilter ) );

		}

		extension = extensions.get( 'EXT_texture_filter_anisotropic' );

		if ( extension && texture.type !== THREE.FloatType ) {

			if ( texture.anisotropy > 1 || texture.__oldAnisotropy ) {

				_gl.texParameterf( textureType, extension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min( texture.anisotropy, _this.getMaxAnisotropy() ) );
				texture.__oldAnisotropy = texture.anisotropy;

			}

		}

	}

	this.uploadTexture = function ( texture ) {

		if ( texture.__webglInit === undefined ) {

			texture.__webglInit = true;

			texture.addEventListener( 'dispose', onTextureDispose );

			texture.__webglTexture = _gl.createTexture();

			_this.info.memory.textures ++;

		}

		_gl.bindTexture( _gl.TEXTURE_2D, texture.__webglTexture );

		_gl.pixelStorei( _gl.UNPACK_FLIP_Y_WEBGL, texture.flipY );
		_gl.pixelStorei( _gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultiplyAlpha );
		_gl.pixelStorei( _gl.UNPACK_ALIGNMENT, texture.unpackAlignment );

		texture.image = clampToMaxSize( texture.image, _maxTextureSize );

		var image = texture.image,
		isImagePowerOfTwo = THREE.Math.isPowerOfTwo( image.width ) && THREE.Math.isPowerOfTwo( image.height ),
		glFormat = paramThreeToGL( texture.format ),
		glType = paramThreeToGL( texture.type );

		setTextureParameters( _gl.TEXTURE_2D, texture, isImagePowerOfTwo );

		var mipmap, mipmaps = texture.mipmaps;

		if ( texture instanceof THREE.DataTexture ) {

			// use manually created mipmaps if available
			// if there are no manual mipmaps
			// set 0 level mipmap and then use GL to generate other mipmap levels

			if ( mipmaps.length > 0 && isImagePowerOfTwo ) {

				for ( var i = 0, il = mipmaps.length; i < il; i ++ ) {

					mipmap = mipmaps[ i ];
					_gl.texImage2D( _gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data );

				}

				texture.generateMipmaps = false;

			} else {

				_gl.texImage2D( _gl.TEXTURE_2D, 0, glFormat, image.width, image.height, 0, glFormat, glType, image.data );

			}

		} else if ( texture instanceof THREE.CompressedTexture ) {

			for ( var i = 0, il = mipmaps.length; i < il; i ++ ) {

				mipmap = mipmaps[ i ];

				if ( texture.format !== THREE.RGBAFormat && texture.format !== THREE.RGBFormat ) {

					if ( getCompressedTextureFormats().indexOf( glFormat ) > -1 ) {

						_gl.compressedTexImage2D( _gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, mipmap.data );

					} else {

						console.warn( "Attempt to load unsupported compressed texture format" );

					}

				} else {

					_gl.texImage2D( _gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data );

				}

			}

		} else { // regular Texture (image, video, canvas)

			// use manually created mipmaps if available
			// if there are no manual mipmaps
			// set 0 level mipmap and then use GL to generate other mipmap levels

			if ( mipmaps.length > 0 && isImagePowerOfTwo ) {

				for ( var i = 0, il = mipmaps.length; i < il; i ++ ) {

					mipmap = mipmaps[ i ];
					_gl.texImage2D( _gl.TEXTURE_2D, i, glFormat, glFormat, glType, mipmap );

				}

				texture.generateMipmaps = false;

			} else {

				_gl.texImage2D( _gl.TEXTURE_2D, 0, glFormat, glFormat, glType, texture.image );

			}

		}

		if ( texture.generateMipmaps && isImagePowerOfTwo ) _gl.generateMipmap( _gl.TEXTURE_2D );

		texture.needsUpdate = false;

		if ( texture.onUpdate ) texture.onUpdate();

	};

	this.setTexture = function ( texture, slot ) {

		_gl.activeTexture( _gl.TEXTURE0 + slot );

		if ( texture.needsUpdate ) {

			_this.uploadTexture( texture );

		} else {

			_gl.bindTexture( _gl.TEXTURE_2D, texture.__webglTexture );

		}

	};

	function clampToMaxSize ( image, maxSize ) {

		if ( image.width > maxSize || image.height > maxSize ) {

			// Warning: Scaling through the canvas will only work with images that use
			// premultiplied alpha.

			var scale = maxSize / Math.max( image.width, image.height );

			var canvas = document.createElement( 'canvas' );
			canvas.width = Math.floor( image.width * scale );
			canvas.height = Math.floor( image.height * scale );

			var context = canvas.getContext( '2d' );
			context.drawImage( image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height );

			console.log( 'THREE.WebGLRenderer:', image, 'is too big (' + image.width + 'x' + image.height + '). Resized to ' + canvas.width + 'x' + canvas.height + '.' );

			return canvas;

		}

		return image;

	}

	function setCubeTexture ( texture, slot ) {

		if ( texture.image.length === 6 ) {

			if ( texture.needsUpdate ) {

				if ( ! texture.image.__webglTextureCube ) {

					texture.addEventListener( 'dispose', onTextureDispose );

					texture.image.__webglTextureCube = _gl.createTexture();

					_this.info.memory.textures ++;

				}

				_gl.activeTexture( _gl.TEXTURE0 + slot );
				_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, texture.image.__webglTextureCube );

				_gl.pixelStorei( _gl.UNPACK_FLIP_Y_WEBGL, texture.flipY );

				var isCompressed = texture instanceof THREE.CompressedTexture;
				var isDataTexture = texture.image[ 0 ] instanceof THREE.DataTexture;

				var cubeImage = [];

				for ( var i = 0; i < 6; i ++ ) {

					if ( _this.autoScaleCubemaps && ! isCompressed && ! isDataTexture ) {

						cubeImage[ i ] = clampToMaxSize( texture.image[ i ], _maxCubemapSize );

					} else {

						cubeImage[ i ] = isDataTexture ? texture.image[ i ].image : texture.image[ i ];

					}

				}

				var image = cubeImage[ 0 ],
				isImagePowerOfTwo = THREE.Math.isPowerOfTwo( image.width ) && THREE.Math.isPowerOfTwo( image.height ),
				glFormat = paramThreeToGL( texture.format ),
				glType = paramThreeToGL( texture.type );

				setTextureParameters( _gl.TEXTURE_CUBE_MAP, texture, isImagePowerOfTwo );

				for ( var i = 0; i < 6; i ++ ) {

					if ( ! isCompressed ) {

						if ( isDataTexture ) {

							_gl.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, cubeImage[ i ].width, cubeImage[ i ].height, 0, glFormat, glType, cubeImage[ i ].data );

						} else {

							_gl.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, glFormat, glType, cubeImage[ i ] );

						}

					} else {

						var mipmap, mipmaps = cubeImage[ i ].mipmaps;

						for ( var j = 0, jl = mipmaps.length; j < jl; j ++ ) {

							mipmap = mipmaps[ j ];

							if ( texture.format !== THREE.RGBAFormat && texture.format !== THREE.RGBFormat ) {

								if ( getCompressedTextureFormats().indexOf( glFormat ) > -1 ) {

									_gl.compressedTexImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, mipmap.data );

								} else {

									console.warn( "Attempt to load unsupported compressed texture format" );

								}

							} else {

								_gl.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data );

							}

						}

					}

				}

				if ( texture.generateMipmaps && isImagePowerOfTwo ) {

					_gl.generateMipmap( _gl.TEXTURE_CUBE_MAP );

				}

				texture.needsUpdate = false;

				if ( texture.onUpdate ) texture.onUpdate();

			} else {

				_gl.activeTexture( _gl.TEXTURE0 + slot );
				_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, texture.image.__webglTextureCube );

			}

		}

	}

	function setCubeTextureDynamic ( texture, slot ) {

		_gl.activeTexture( _gl.TEXTURE0 + slot );
		_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, texture.__webglTexture );

	}

	// Render targets

	function setupFrameBuffer ( framebuffer, renderTarget, textureTarget ) {

		_gl.bindFramebuffer( _gl.FRAMEBUFFER, framebuffer );
		_gl.framebufferTexture2D( _gl.FRAMEBUFFER, _gl.COLOR_ATTACHMENT0, textureTarget, renderTarget.__webglTexture, 0 );

	}

	function setupRenderBuffer ( renderbuffer, renderTarget  ) {

		_gl.bindRenderbuffer( _gl.RENDERBUFFER, renderbuffer );

		if ( renderTarget.depthBuffer && ! renderTarget.stencilBuffer ) {

			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height );
			_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer );

		/* For some reason this is not working. Defaulting to RGBA4.
		} else if ( ! renderTarget.depthBuffer && renderTarget.stencilBuffer ) {

			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.STENCIL_INDEX8, renderTarget.width, renderTarget.height );
			_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.STENCIL_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer );
		*/
		} else if ( renderTarget.depthBuffer && renderTarget.stencilBuffer ) {

			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.DEPTH_STENCIL, renderTarget.width, renderTarget.height );
			_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.DEPTH_STENCIL_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer );

		} else {

			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.RGBA4, renderTarget.width, renderTarget.height );

		}

	}

	this.setRenderTarget = function ( renderTarget ) {

		var isCube = ( renderTarget instanceof THREE.WebGLRenderTargetCube );

		if ( renderTarget && renderTarget.__webglFramebuffer === undefined ) {

			if ( renderTarget.depthBuffer === undefined ) renderTarget.depthBuffer = true;
			if ( renderTarget.stencilBuffer === undefined ) renderTarget.stencilBuffer = true;

			renderTarget.addEventListener( 'dispose', onRenderTargetDispose );

			renderTarget.__webglTexture = _gl.createTexture();

			_this.info.memory.textures ++;

			// Setup texture, create render and frame buffers

			var isTargetPowerOfTwo = THREE.Math.isPowerOfTwo( renderTarget.width ) && THREE.Math.isPowerOfTwo( renderTarget.height ),
				glFormat = paramThreeToGL( renderTarget.format ),
				glType = paramThreeToGL( renderTarget.type );

			if ( isCube ) {

				renderTarget.__webglFramebuffer = [];
				renderTarget.__webglRenderbuffer = [];

				_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, renderTarget.__webglTexture );
				setTextureParameters( _gl.TEXTURE_CUBE_MAP, renderTarget, isTargetPowerOfTwo );

				for ( var i = 0; i < 6; i ++ ) {

					renderTarget.__webglFramebuffer[ i ] = _gl.createFramebuffer();
					renderTarget.__webglRenderbuffer[ i ] = _gl.createRenderbuffer();

					_gl.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, renderTarget.width, renderTarget.height, 0, glFormat, glType, null );

					setupFrameBuffer( renderTarget.__webglFramebuffer[ i ], renderTarget, _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i );
					setupRenderBuffer( renderTarget.__webglRenderbuffer[ i ], renderTarget );

				}

				if ( isTargetPowerOfTwo ) _gl.generateMipmap( _gl.TEXTURE_CUBE_MAP );

			} else {

				renderTarget.__webglFramebuffer = _gl.createFramebuffer();

				if ( renderTarget.shareDepthFrom ) {

					renderTarget.__webglRenderbuffer = renderTarget.shareDepthFrom.__webglRenderbuffer;

				} else {

					renderTarget.__webglRenderbuffer = _gl.createRenderbuffer();

				}

				_gl.bindTexture( _gl.TEXTURE_2D, renderTarget.__webglTexture );
				setTextureParameters( _gl.TEXTURE_2D, renderTarget, isTargetPowerOfTwo );

				_gl.texImage2D( _gl.TEXTURE_2D, 0, glFormat, renderTarget.width, renderTarget.height, 0, glFormat, glType, null );

				setupFrameBuffer( renderTarget.__webglFramebuffer, renderTarget, _gl.TEXTURE_2D );

				if ( renderTarget.shareDepthFrom ) {

					if ( renderTarget.depthBuffer && ! renderTarget.stencilBuffer ) {

						_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, renderTarget.__webglRenderbuffer );

					} else if ( renderTarget.depthBuffer && renderTarget.stencilBuffer ) {

						_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.DEPTH_STENCIL_ATTACHMENT, _gl.RENDERBUFFER, renderTarget.__webglRenderbuffer );

					}

				} else {

					setupRenderBuffer( renderTarget.__webglRenderbuffer, renderTarget );

				}

				if ( isTargetPowerOfTwo ) _gl.generateMipmap( _gl.TEXTURE_2D );

			}

			// Release everything

			if ( isCube ) {

				_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, null );

			} else {

				_gl.bindTexture( _gl.TEXTURE_2D, null );

			}

			_gl.bindRenderbuffer( _gl.RENDERBUFFER, null );
			_gl.bindFramebuffer( _gl.FRAMEBUFFER, null );

		}

		var framebuffer, width, height, vx, vy;

		if ( renderTarget ) {

			if ( isCube ) {

				framebuffer = renderTarget.__webglFramebuffer[ renderTarget.activeCubeFace ];

			} else {

				framebuffer = renderTarget.__webglFramebuffer;

			}

			width = renderTarget.width;
			height = renderTarget.height;

			vx = 0;
			vy = 0;

		} else {

			framebuffer = null;

			width = _viewportWidth;
			height = _viewportHeight;

			vx = _viewportX;
			vy = _viewportY;

		}

		if ( framebuffer !== _currentFramebuffer ) {

			_gl.bindFramebuffer( _gl.FRAMEBUFFER, framebuffer );
			_gl.viewport( vx, vy, width, height );

			_currentFramebuffer = framebuffer;

		}

		_currentWidth = width;
		_currentHeight = height;

	};

	function updateRenderTargetMipmap ( renderTarget ) {

		if ( renderTarget instanceof THREE.WebGLRenderTargetCube ) {

			_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, renderTarget.__webglTexture );
			_gl.generateMipmap( _gl.TEXTURE_CUBE_MAP );
			_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, null );

		} else {

			_gl.bindTexture( _gl.TEXTURE_2D, renderTarget.__webglTexture );
			_gl.generateMipmap( _gl.TEXTURE_2D );
			_gl.bindTexture( _gl.TEXTURE_2D, null );

		}

	}

	// Fallback filters for non-power-of-2 textures

	function filterFallback ( f ) {

		if ( f === THREE.NearestFilter || f === THREE.NearestMipMapNearestFilter || f === THREE.NearestMipMapLinearFilter ) {

			return _gl.NEAREST;

		}

		return _gl.LINEAR;

	}

	// Map three.js constants to WebGL constants

	function paramThreeToGL ( p ) {

		var extension;

		if ( p === THREE.RepeatWrapping ) return _gl.REPEAT;
		if ( p === THREE.ClampToEdgeWrapping ) return _gl.CLAMP_TO_EDGE;
		if ( p === THREE.MirroredRepeatWrapping ) return _gl.MIRRORED_REPEAT;

		if ( p === THREE.NearestFilter ) return _gl.NEAREST;
		if ( p === THREE.NearestMipMapNearestFilter ) return _gl.NEAREST_MIPMAP_NEAREST;
		if ( p === THREE.NearestMipMapLinearFilter ) return _gl.NEAREST_MIPMAP_LINEAR;

		if ( p === THREE.LinearFilter ) return _gl.LINEAR;
		if ( p === THREE.LinearMipMapNearestFilter ) return _gl.LINEAR_MIPMAP_NEAREST;
		if ( p === THREE.LinearMipMapLinearFilter ) return _gl.LINEAR_MIPMAP_LINEAR;

		if ( p === THREE.UnsignedByteType ) return _gl.UNSIGNED_BYTE;
		if ( p === THREE.UnsignedShort4444Type ) return _gl.UNSIGNED_SHORT_4_4_4_4;
		if ( p === THREE.UnsignedShort5551Type ) return _gl.UNSIGNED_SHORT_5_5_5_1;
		if ( p === THREE.UnsignedShort565Type ) return _gl.UNSIGNED_SHORT_5_6_5;

		if ( p === THREE.ByteType ) return _gl.BYTE;
		if ( p === THREE.ShortType ) return _gl.SHORT;
		if ( p === THREE.UnsignedShortType ) return _gl.UNSIGNED_SHORT;
		if ( p === THREE.IntType ) return _gl.INT;
		if ( p === THREE.UnsignedIntType ) return _gl.UNSIGNED_INT;
		if ( p === THREE.FloatType ) return _gl.FLOAT;

		if ( p === THREE.AlphaFormat ) return _gl.ALPHA;
		if ( p === THREE.RGBFormat ) return _gl.RGB;
		if ( p === THREE.RGBAFormat ) return _gl.RGBA;
		if ( p === THREE.LuminanceFormat ) return _gl.LUMINANCE;
		if ( p === THREE.LuminanceAlphaFormat ) return _gl.LUMINANCE_ALPHA;

		if ( p === THREE.AddEquation ) return _gl.FUNC_ADD;
		if ( p === THREE.SubtractEquation ) return _gl.FUNC_SUBTRACT;
		if ( p === THREE.ReverseSubtractEquation ) return _gl.FUNC_REVERSE_SUBTRACT;

		if ( p === THREE.ZeroFactor ) return _gl.ZERO;
		if ( p === THREE.OneFactor ) return _gl.ONE;
		if ( p === THREE.SrcColorFactor ) return _gl.SRC_COLOR;
		if ( p === THREE.OneMinusSrcColorFactor ) return _gl.ONE_MINUS_SRC_COLOR;
		if ( p === THREE.SrcAlphaFactor ) return _gl.SRC_ALPHA;
		if ( p === THREE.OneMinusSrcAlphaFactor ) return _gl.ONE_MINUS_SRC_ALPHA;
		if ( p === THREE.DstAlphaFactor ) return _gl.DST_ALPHA;
		if ( p === THREE.OneMinusDstAlphaFactor ) return _gl.ONE_MINUS_DST_ALPHA;

		if ( p === THREE.DstColorFactor ) return _gl.DST_COLOR;
		if ( p === THREE.OneMinusDstColorFactor ) return _gl.ONE_MINUS_DST_COLOR;
		if ( p === THREE.SrcAlphaSaturateFactor ) return _gl.SRC_ALPHA_SATURATE;

		extension = extensions.get( 'WEBGL_compressed_texture_s3tc' );

		if ( extension !== null ) {

			if ( p === THREE.RGB_S3TC_DXT1_Format ) return extension.COMPRESSED_RGB_S3TC_DXT1_EXT;
			if ( p === THREE.RGBA_S3TC_DXT1_Format ) return extension.COMPRESSED_RGBA_S3TC_DXT1_EXT;
			if ( p === THREE.RGBA_S3TC_DXT3_Format ) return extension.COMPRESSED_RGBA_S3TC_DXT3_EXT;
			if ( p === THREE.RGBA_S3TC_DXT5_Format ) return extension.COMPRESSED_RGBA_S3TC_DXT5_EXT;

		}

		extension = extensions.get( 'WEBGL_compressed_texture_pvrtc' );

		if ( extension !== null ) {

			if ( p === THREE.RGB_PVRTC_4BPPV1_Format ) return extension.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
			if ( p === THREE.RGB_PVRTC_2BPPV1_Format ) return extension.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
			if ( p === THREE.RGBA_PVRTC_4BPPV1_Format ) return extension.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
			if ( p === THREE.RGBA_PVRTC_2BPPV1_Format ) return extension.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;

		}

		extension = extensions.get( 'EXT_blend_minmax' );

		if ( extension !== null ) {

			if ( p === THREE.MinEquation ) return extension.MIN_EXT;
			if ( p === THREE.MaxEquation ) return extension.MAX_EXT;

		}

		return 0;

	}

	// Allocations

	function allocateBones ( object ) {

		if ( _supportsBoneTextures && object && object.skeleton && object.skeleton.useVertexTexture ) {

			return 1024;

		} else {

			// default for when object is not specified
			// ( for example when prebuilding shader
			//   to be used with multiple objects )
			//
			//  - leave some extra space for other uniforms
			//  - limit here is ANGLE's 254 max uniform vectors
			//    (up to 54 should be safe)

			var nVertexUniforms = _gl.getParameter( _gl.MAX_VERTEX_UNIFORM_VECTORS );
			var nVertexMatrices = Math.floor( ( nVertexUniforms - 20 ) / 4 );

			var maxBones = nVertexMatrices;

			if ( object !== undefined && object instanceof THREE.SkinnedMesh ) {

				maxBones = Math.min( object.skeleton.bones.length, maxBones );

				if ( maxBones < object.skeleton.bones.length ) {

					console.warn( 'WebGLRenderer: too many bones - ' + object.skeleton.bones.length + ', this GPU supports just ' + maxBones + ' (try OpenGL instead of ANGLE)' );

				}

			}

			return maxBones;

		}

	}

	function allocateLights( lights ) {

		var dirLights = 0;
		var pointLights = 0;
		var spotLights = 0;
		var hemiLights = 0;

		for ( var l = 0, ll = lights.length; l < ll; l ++ ) {

			var light = lights[ l ];

			if ( light.onlyShadow || light.visible === false ) continue;

			if ( light instanceof THREE.DirectionalLight ) dirLights ++;
			if ( light instanceof THREE.PointLight ) pointLights ++;
			if ( light instanceof THREE.SpotLight ) spotLights ++;
			if ( light instanceof THREE.HemisphereLight ) hemiLights ++;

		}

		return { 'directional': dirLights, 'point': pointLights, 'spot': spotLights, 'hemi': hemiLights };

	}

	function allocateShadows( lights ) {

		var maxShadows = 0;

		for ( var l = 0, ll = lights.length; l < ll; l ++ ) {

			var light = lights[ l ];

			if ( ! light.castShadow ) continue;

			if ( light instanceof THREE.SpotLight ) maxShadows ++;
			if ( light instanceof THREE.DirectionalLight && ! light.shadowCascade ) maxShadows ++;

		}

		return maxShadows;

	}

	// DEPRECATED
	
	this.initMaterial = function () {

		console.warn( 'THREE.WebGLRenderer: .initMaterial() has been removed.' );

	};

	this.addPrePlugin = function () {

		console.warn( 'THREE.WebGLRenderer: .addPrePlugin() has been removed.' );

	};

	this.addPostPlugin = function () {

		console.warn( 'THREE.WebGLRenderer: .addPostPlugin() has been removed.' );

	};

	this.updateShadowMap = function () {

		console.warn( 'THREE.WebGLRenderer: .updateShadowMap() has been removed.' );

	};

};

// File:src/renderers/WebGLRenderTarget.js

/**
 * @author szimek / https://github.com/szimek/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.WebGLRenderTarget = function ( width, height, options ) {

	this.width = width;
	this.height = height;

	options = options || {};

	this.wrapS = options.wrapS !== undefined ? options.wrapS : THREE.ClampToEdgeWrapping;
	this.wrapT = options.wrapT !== undefined ? options.wrapT : THREE.ClampToEdgeWrapping;

	this.magFilter = options.magFilter !== undefined ? options.magFilter : THREE.LinearFilter;
	this.minFilter = options.minFilter !== undefined ? options.minFilter : THREE.LinearMipMapLinearFilter;

	this.anisotropy = options.anisotropy !== undefined ? options.anisotropy : 1;

	this.offset = new THREE.Vector2( 0, 0 );
	this.repeat = new THREE.Vector2( 1, 1 );

	this.format = options.format !== undefined ? options.format : THREE.RGBAFormat;
	this.type = options.type !== undefined ? options.type : THREE.UnsignedByteType;

	this.depthBuffer = options.depthBuffer !== undefined ? options.depthBuffer : true;
	this.stencilBuffer = options.stencilBuffer !== undefined ? options.stencilBuffer : true;

	this.generateMipmaps = true;

	this.shareDepthFrom = null;

};

THREE.WebGLRenderTarget.prototype = {

	constructor: THREE.WebGLRenderTarget,

	setSize: function ( width, height ) {

		this.width = width;
		this.height = height;

	},

	clone: function () {

		var tmp = new THREE.WebGLRenderTarget( this.width, this.height );

		tmp.wrapS = this.wrapS;
		tmp.wrapT = this.wrapT;

		tmp.magFilter = this.magFilter;
		tmp.minFilter = this.minFilter;

		tmp.anisotropy = this.anisotropy;

		tmp.offset.copy( this.offset );
		tmp.repeat.copy( this.repeat );

		tmp.format = this.format;
		tmp.type = this.type;

		tmp.depthBuffer = this.depthBuffer;
		tmp.stencilBuffer = this.stencilBuffer;

		tmp.generateMipmaps = this.generateMipmaps;

		tmp.shareDepthFrom = this.shareDepthFrom;

		return tmp;

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

};

THREE.EventDispatcher.prototype.apply( THREE.WebGLRenderTarget.prototype );

// File:src/renderers/WebGLRenderTargetCube.js

/**
 * @author alteredq / http://alteredqualia.com
 */

THREE.WebGLRenderTargetCube = function ( width, height, options ) {

	THREE.WebGLRenderTarget.call( this, width, height, options );

	this.activeCubeFace = 0; // PX 0, NX 1, PY 2, NY 3, PZ 4, NZ 5

};

THREE.WebGLRenderTargetCube.prototype = Object.create( THREE.WebGLRenderTarget.prototype );

// File:src/renderers/webgl/WebGLExtensions.js

THREE.WebGLExtensions = function ( gl ) {

	var extensions = {};

	this.get = function ( name ) {

		if ( extensions[ name ] !== undefined ) {

			return extensions[ name ];

		}

		var extension;

		switch ( name ) {
		
			case 'OES_texture_float':
				extension = gl.getExtension( 'OES_texture_float' );
				break;

			case 'OES_texture_float_linear':
				extension = gl.getExtension( 'OES_texture_float_linear' );
				break;

			case 'OES_standard_derivatives':
				extension = gl.getExtension( 'OES_standard_derivatives' );
				break;

			case 'EXT_texture_filter_anisotropic':
				extension = gl.getExtension( 'EXT_texture_filter_anisotropic' ) || gl.getExtension( 'MOZ_EXT_texture_filter_anisotropic' ) || gl.getExtension( 'WEBKIT_EXT_texture_filter_anisotropic' );
				break;

			case 'WEBGL_compressed_texture_s3tc':
				extension = gl.getExtension( 'WEBGL_compressed_texture_s3tc' ) || gl.getExtension( 'MOZ_WEBGL_compressed_texture_s3tc' ) || gl.getExtension( 'WEBKIT_WEBGL_compressed_texture_s3tc' );
				break;

			case 'WEBGL_compressed_texture_pvrtc':
				extension = gl.getExtension( 'WEBGL_compressed_texture_pvrtc' ) || gl.getExtension( 'WEBKIT_WEBGL_compressed_texture_pvrtc' );
				break;

			case 'OES_element_index_uint':
				extension = gl.getExtension( 'OES_element_index_uint' );
				break;

			case 'EXT_blend_minmax':
				extension = gl.getExtension( 'EXT_blend_minmax' );
				break;

			case 'EXT_frag_depth':
				extension = gl.getExtension( 'EXT_frag_depth' );
				break;

		}

		if ( extension === null ) {

			console.log( 'THREE.WebGLRenderer: ' + name + ' extension not supported.' );

		}

		extensions[ name ] = extension;

		return extension;

	};

};

// File:src/renderers/webgl/WebGLProgram.js

THREE.WebGLProgram = ( function () {

	var programIdCount = 0;

	var generateDefines = function ( defines ) {

		var value, chunk, chunks = [];

		for ( var d in defines ) {

			value = defines[ d ];
			if ( value === false ) continue;

			chunk = "#define " + d + " " + value;
			chunks.push( chunk );

		}

		return chunks.join( "\n" );

	};

	var cacheUniformLocations = function ( gl, program, identifiers ) {

		var uniforms = {};

		for ( var i = 0, l = identifiers.length; i < l; i ++ ) {

			var id = identifiers[ i ];
			uniforms[ id ] = gl.getUniformLocation( program, id );

		}

		return uniforms;

	};

	var cacheAttributeLocations = function ( gl, program, identifiers ) {

		var attributes = {};

		for ( var i = 0, l = identifiers.length; i < l; i ++ ) {

			var id = identifiers[ i ];
			attributes[ id ] = gl.getAttribLocation( program, id );

		}

		return attributes;

	};

	return function ( renderer, code, material, parameters ) {

		var _this = renderer;
		var _gl = _this.context;

		var defines = material.defines;
		var uniforms = material.__webglShader.uniforms;
		var attributes = material.attributes;

		var vertexShader = material.__webglShader.vertexShader;
		var fragmentShader = material.__webglShader.fragmentShader;

		var index0AttributeName = material.index0AttributeName;

		if ( index0AttributeName === undefined && parameters.morphTargets === true ) {

			// programs with morphTargets displace position out of attribute 0

			index0AttributeName = 'position';

		}

		var shadowMapTypeDefine = "SHADOWMAP_TYPE_BASIC";

		if ( parameters.shadowMapType === THREE.PCFShadowMap ) {

			shadowMapTypeDefine = "SHADOWMAP_TYPE_PCF";

		} else if ( parameters.shadowMapType === THREE.PCFSoftShadowMap ) {

			shadowMapTypeDefine = "SHADOWMAP_TYPE_PCF_SOFT";

		}

		// console.log( "building new program " );

		//

		var customDefines = generateDefines( defines );

		//

		var program = _gl.createProgram();

		var prefix_vertex, prefix_fragment;

		if ( material instanceof THREE.RawShaderMaterial ) {

			prefix_vertex = '';
			prefix_fragment = '';

		} else {

			prefix_vertex = [

				"precision " + parameters.precision + " float;",
				"precision " + parameters.precision + " int;",

				customDefines,

				parameters.supportsVertexTextures ? "#define VERTEX_TEXTURES" : "",

				_this.gammaInput ? "#define GAMMA_INPUT" : "",
				_this.gammaOutput ? "#define GAMMA_OUTPUT" : "",

				"#define MAX_DIR_LIGHTS " + parameters.maxDirLights,
				"#define MAX_POINT_LIGHTS " + parameters.maxPointLights,
				"#define MAX_SPOT_LIGHTS " + parameters.maxSpotLights,
				"#define MAX_HEMI_LIGHTS " + parameters.maxHemiLights,

				"#define MAX_SHADOWS " + parameters.maxShadows,

				"#define MAX_BONES " + parameters.maxBones,

				parameters.map ? "#define USE_MAP" : "",
				parameters.envMap ? "#define USE_ENVMAP" : "",
				parameters.lightMap ? "#define USE_LIGHTMAP" : "",
				parameters.bumpMap ? "#define USE_BUMPMAP" : "",
				parameters.normalMap ? "#define USE_NORMALMAP" : "",
				parameters.specularMap ? "#define USE_SPECULARMAP" : "",
				parameters.alphaMap ? "#define USE_ALPHAMAP" : "",
				parameters.vertexColors ? "#define USE_COLOR" : "",

				parameters.skinning ? "#define USE_SKINNING" : "",
				parameters.useVertexTexture ? "#define BONE_TEXTURE" : "",

				parameters.morphTargets ? "#define USE_MORPHTARGETS" : "",
				parameters.morphNormals ? "#define USE_MORPHNORMALS" : "",
				parameters.wrapAround ? "#define WRAP_AROUND" : "",
				parameters.doubleSided ? "#define DOUBLE_SIDED" : "",
				parameters.flipSided ? "#define FLIP_SIDED" : "",

				parameters.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
				parameters.shadowMapEnabled ? "#define " + shadowMapTypeDefine : "",
				parameters.shadowMapDebug ? "#define SHADOWMAP_DEBUG" : "",
				parameters.shadowMapCascade ? "#define SHADOWMAP_CASCADE" : "",

				parameters.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",

				parameters.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
				//_this._glExtensionFragDepth ? "#define USE_LOGDEPTHBUF_EXT" : "",


				"uniform mat4 modelMatrix;",
				"uniform mat4 modelViewMatrix;",
				"uniform mat4 projectionMatrix;",
				"uniform mat4 viewMatrix;",
				"uniform mat3 normalMatrix;",
				"uniform vec3 cameraPosition;",

				"attribute vec3 position;",
				"attribute vec3 normal;",
				"attribute vec2 uv;",
				"attribute vec2 uv2;",

				"#ifdef USE_COLOR",

				"	attribute vec3 color;",

				"#endif",

				"#ifdef USE_MORPHTARGETS",

				"	attribute vec3 morphTarget0;",
				"	attribute vec3 morphTarget1;",
				"	attribute vec3 morphTarget2;",
				"	attribute vec3 morphTarget3;",

				"	#ifdef USE_MORPHNORMALS",

				"		attribute vec3 morphNormal0;",
				"		attribute vec3 morphNormal1;",
				"		attribute vec3 morphNormal2;",
				"		attribute vec3 morphNormal3;",

				"	#else",

				"		attribute vec3 morphTarget4;",
				"		attribute vec3 morphTarget5;",
				"		attribute vec3 morphTarget6;",
				"		attribute vec3 morphTarget7;",

				"	#endif",

				"#endif",

				"#ifdef USE_SKINNING",

				"	attribute vec4 skinIndex;",
				"	attribute vec4 skinWeight;",

				"#endif",

				""

			].join( '\n' );

			prefix_fragment = [

				"precision " + parameters.precision + " float;",
				"precision " + parameters.precision + " int;",

				( parameters.bumpMap || parameters.normalMap ) ? "#extension GL_OES_standard_derivatives : enable" : "",

				customDefines,

				"#define MAX_DIR_LIGHTS " + parameters.maxDirLights,
				"#define MAX_POINT_LIGHTS " + parameters.maxPointLights,
				"#define MAX_SPOT_LIGHTS " + parameters.maxSpotLights,
				"#define MAX_HEMI_LIGHTS " + parameters.maxHemiLights,

				"#define MAX_SHADOWS " + parameters.maxShadows,

				parameters.alphaTest ? "#define ALPHATEST " + parameters.alphaTest: "",

				_this.gammaInput ? "#define GAMMA_INPUT" : "",
				_this.gammaOutput ? "#define GAMMA_OUTPUT" : "",

				( parameters.useFog && parameters.fog ) ? "#define USE_FOG" : "",
				( parameters.useFog && parameters.fogExp ) ? "#define FOG_EXP2" : "",

				parameters.map ? "#define USE_MAP" : "",
				parameters.envMap ? "#define USE_ENVMAP" : "",
				parameters.lightMap ? "#define USE_LIGHTMAP" : "",
				parameters.bumpMap ? "#define USE_BUMPMAP" : "",
				parameters.normalMap ? "#define USE_NORMALMAP" : "",
				parameters.specularMap ? "#define USE_SPECULARMAP" : "",
				parameters.alphaMap ? "#define USE_ALPHAMAP" : "",
				parameters.vertexColors ? "#define USE_COLOR" : "",

				parameters.metal ? "#define METAL" : "",
				parameters.wrapAround ? "#define WRAP_AROUND" : "",
				parameters.doubleSided ? "#define DOUBLE_SIDED" : "",
				parameters.flipSided ? "#define FLIP_SIDED" : "",

				parameters.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
				parameters.shadowMapEnabled ? "#define " + shadowMapTypeDefine : "",
				parameters.shadowMapDebug ? "#define SHADOWMAP_DEBUG" : "",
				parameters.shadowMapCascade ? "#define SHADOWMAP_CASCADE" : "",

				parameters.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
				//_this._glExtensionFragDepth ? "#define USE_LOGDEPTHBUF_EXT" : "",

				"uniform mat4 viewMatrix;",
				"uniform vec3 cameraPosition;",
				""

			].join( '\n' );

		}

		var glVertexShader = new THREE.WebGLShader( _gl, _gl.VERTEX_SHADER, prefix_vertex + vertexShader );
		var glFragmentShader = new THREE.WebGLShader( _gl, _gl.FRAGMENT_SHADER, prefix_fragment + fragmentShader );

		_gl.attachShader( program, glVertexShader );
		_gl.attachShader( program, glFragmentShader );

		if ( index0AttributeName !== undefined ) {

			// Force a particular attribute to index 0.
			// because potentially expensive emulation is done by browser if attribute 0 is disabled.
			// And, color, for example is often automatically bound to index 0 so disabling it

			_gl.bindAttribLocation( program, 0, index0AttributeName );

		}

		_gl.linkProgram( program );

		if ( _gl.getProgramParameter( program, _gl.LINK_STATUS ) === false ) {

			console.error( 'THREE.WebGLProgram: Could not initialise shader.' );
			console.error( 'gl.VALIDATE_STATUS', _gl.getProgramParameter( program, _gl.VALIDATE_STATUS ) );
			console.error( 'gl.getError()', _gl.getError() );

		}

		if ( _gl.getProgramInfoLog( program ) !== '' ) {

			console.warn( 'THREE.WebGLProgram: gl.getProgramInfoLog()', _gl.getProgramInfoLog( program ) );

		}

		// clean up

		_gl.deleteShader( glVertexShader );
		_gl.deleteShader( glFragmentShader );

		// cache uniform locations

		var identifiers = [

			'viewMatrix', 'modelViewMatrix', 'projectionMatrix', 'normalMatrix', 'modelMatrix', 'cameraPosition', 'morphTargetInfluences', 'bindMatrix', 'bindMatrixInverse'

		];

		if ( parameters.useVertexTexture ) {

			identifiers.push( 'boneTexture' );
			identifiers.push( 'boneTextureWidth' );
			identifiers.push( 'boneTextureHeight' );

		} else {

			identifiers.push( 'boneGlobalMatrices' );

		}

		if ( parameters.logarithmicDepthBuffer ) {

			identifiers.push('logDepthBufFC');

		}


		for ( var u in uniforms ) {

			identifiers.push( u );

		}

		this.uniforms = cacheUniformLocations( _gl, program, identifiers );

		// cache attributes locations

		identifiers = [

			"position", "normal", "uv", "uv2", "tangent", "color",
			"skinIndex", "skinWeight", "lineDistance"

		];

		for ( var i = 0; i < parameters.maxMorphTargets; i ++ ) {

			identifiers.push( "morphTarget" + i );

		}

		for ( var i = 0; i < parameters.maxMorphNormals; i ++ ) {

			identifiers.push( "morphNormal" + i );

		}

		for ( var a in attributes ) {

			identifiers.push( a );

		}

		this.attributes = cacheAttributeLocations( _gl, program, identifiers );
		this.attributesKeys = Object.keys( this.attributes );

		//

		this.id = programIdCount ++;
		this.code = code;
		this.usedTimes = 1;
		this.program = program;
		this.vertexShader = glVertexShader;
		this.fragmentShader = glFragmentShader;

		return this;

	};

} )();

// File:src/renderers/webgl/WebGLShader.js

THREE.WebGLShader = ( function () {

	var addLineNumbers = function ( string ) {

		var lines = string.split( '\n' );

		for ( var i = 0; i < lines.length; i ++ ) {

			lines[ i ] = ( i + 1 ) + ': ' + lines[ i ];

		}

		return lines.join( '\n' );

	};

	return function ( gl, type, string ) {

		var shader = gl.createShader( type ); 

		gl.shaderSource( shader, string );
		gl.compileShader( shader );

		if ( gl.getShaderParameter( shader, gl.COMPILE_STATUS ) === false ) {

			console.error( 'THREE.WebGLShader: Shader couldn\'t compile.' );

		}

		if ( gl.getShaderInfoLog( shader ) !== '' ) {

			console.warn( 'THREE.WebGLShader: gl.getShaderInfoLog()', gl.getShaderInfoLog( shader ) );
			console.warn( addLineNumbers( string ) );

		}

		// --enable-privileged-webgl-extension
		// console.log( type, gl.getExtension( 'WEBGL_debug_shaders' ).getTranslatedShaderSource( shader ) );

		return shader;

	};

} )();

// File:src/renderers/webgl/plugins/LensFlarePlugin.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.LensFlarePlugin = function ( renderer, flares ) {

	var gl = renderer.context;

	var vertexBuffer, elementBuffer;
	var program, attributes, uniforms;
	var hasVertexTexture;

	var tempTexture, occlusionTexture;

	var init = function () {

		var vertices = new Float32Array( [
			-1, -1,  0, 0,
			 1, -1,  1, 0,
			 1,  1,  1, 1,
			-1,  1,  0, 1
		] );

		var faces = new Uint16Array( [
			0, 1, 2,
			0, 2, 3
		] );

		// buffers

		vertexBuffer     = gl.createBuffer();
		elementBuffer    = gl.createBuffer();

		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, elementBuffer );
		gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW );

		// textures

		tempTexture      = gl.createTexture();
		occlusionTexture = gl.createTexture();

		gl.bindTexture( gl.TEXTURE_2D, tempTexture );
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, 16, 16, 0, gl.RGB, gl.UNSIGNED_BYTE, null );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );

		gl.bindTexture( gl.TEXTURE_2D, occlusionTexture );
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, 16, 16, 0, gl.RGBA, gl.UNSIGNED_BYTE, null );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );

		hasVertexTexture = gl.getParameter( gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS ) > 0;

		var shader;

		if ( hasVertexTexture ) {

			shader = {

				vertexShader: [

					"uniform lowp int renderType;",

					"uniform vec3 screenPosition;",
					"uniform vec2 scale;",
					"uniform float rotation;",

					"uniform sampler2D occlusionMap;",

					"attribute vec2 position;",
					"attribute vec2 uv;",

					"varying vec2 vUV;",
					"varying float vVisibility;",

					"void main() {",

						"vUV = uv;",

						"vec2 pos = position;",

						"if( renderType == 2 ) {",

							"vec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.5, 0.1 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.9, 0.1 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.9, 0.9 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.1, 0.9 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.5, 0.5 ) );",

							"vVisibility =        visibility.r / 9.0;",
							"vVisibility *= 1.0 - visibility.g / 9.0;",
							"vVisibility *=       visibility.b / 9.0;",
							"vVisibility *= 1.0 - visibility.a / 9.0;",

							"pos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;",
							"pos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;",

						"}",

						"gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );",

					"}"

				].join( "\n" ),

				fragmentShader: [

					"uniform lowp int renderType;",

					"uniform sampler2D map;",
					"uniform float opacity;",
					"uniform vec3 color;",

					"varying vec2 vUV;",
					"varying float vVisibility;",

					"void main() {",

						// pink square

						"if( renderType == 0 ) {",

							"gl_FragColor = vec4( 1.0, 0.0, 1.0, 0.0 );",

						// restore

						"} else if( renderType == 1 ) {",

							"gl_FragColor = texture2D( map, vUV );",

						// flare

						"} else {",

							"vec4 texture = texture2D( map, vUV );",
							"texture.a *= opacity * vVisibility;",
							"gl_FragColor = texture;",
							"gl_FragColor.rgb *= color;",

						"}",

					"}"

				].join( "\n" )

			};

		} else {

			shader = {

				vertexShader: [

					"uniform lowp int renderType;",

					"uniform vec3 screenPosition;",
					"uniform vec2 scale;",
					"uniform float rotation;",

					"attribute vec2 position;",
					"attribute vec2 uv;",

					"varying vec2 vUV;",

					"void main() {",

						"vUV = uv;",

						"vec2 pos = position;",

						"if( renderType == 2 ) {",

							"pos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;",
							"pos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;",

						"}",

						"gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );",

					"}"

				].join( "\n" ),

				fragmentShader: [

					"precision mediump float;",

					"uniform lowp int renderType;",

					"uniform sampler2D map;",
					"uniform sampler2D occlusionMap;",
					"uniform float opacity;",
					"uniform vec3 color;",

					"varying vec2 vUV;",

					"void main() {",

						// pink square

						"if( renderType == 0 ) {",

							"gl_FragColor = vec4( texture2D( map, vUV ).rgb, 0.0 );",

						// restore

						"} else if( renderType == 1 ) {",

							"gl_FragColor = texture2D( map, vUV );",

						// flare

						"} else {",

							"float visibility = texture2D( occlusionMap, vec2( 0.5, 0.1 ) ).a;",
							"visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) ).a;",
							"visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) ).a;",
							"visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) ).a;",
							"visibility = ( 1.0 - visibility / 4.0 );",

							"vec4 texture = texture2D( map, vUV );",
							"texture.a *= opacity * visibility;",
							"gl_FragColor = texture;",
							"gl_FragColor.rgb *= color;",

						"}",

					"}"

				].join( "\n" )

			};

		}

		program = createProgram( shader );

		attributes = {
			vertex: gl.getAttribLocation ( program, "position" ),
			uv:     gl.getAttribLocation ( program, "uv" )
		}

		uniforms = {
			renderType:     gl.getUniformLocation( program, "renderType" ),
			map:            gl.getUniformLocation( program, "map" ),
			occlusionMap:   gl.getUniformLocation( program, "occlusionMap" ),
			opacity:        gl.getUniformLocation( program, "opacity" ),
			color:          gl.getUniformLocation( program, "color" ),
			scale:          gl.getUniformLocation( program, "scale" ),
			rotation:       gl.getUniformLocation( program, "rotation" ),
			screenPosition: gl.getUniformLocation( program, "screenPosition" )
		};

	};

	/*
	 * Render lens flares
	 * Method: renders 16x16 0xff00ff-colored points scattered over the light source area,
	 *         reads these back and calculates occlusion.
	 */

	this.render = function ( scene, camera, viewportWidth, viewportHeight ) {

		if ( flares.length === 0 ) return;

		var tempPosition = new THREE.Vector3();

		var invAspect = viewportHeight / viewportWidth,
			halfViewportWidth = viewportWidth * 0.5,
			halfViewportHeight = viewportHeight * 0.5;

		var size = 16 / viewportHeight,
			scale = new THREE.Vector2( size * invAspect, size );

		var screenPosition = new THREE.Vector3( 1, 1, 0 ),
			screenPositionPixels = new THREE.Vector2( 1, 1 );

		if ( program === undefined ) {

			init();

		}

		gl.useProgram( program );

		gl.enableVertexAttribArray( attributes.vertex );
		gl.enableVertexAttribArray( attributes.uv );

		// loop through all lens flares to update their occlusion and positions
		// setup gl and common used attribs/unforms

		gl.uniform1i( uniforms.occlusionMap, 0 );
		gl.uniform1i( uniforms.map, 1 );

		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
		gl.vertexAttribPointer( attributes.vertex, 2, gl.FLOAT, false, 2 * 8, 0 );
		gl.vertexAttribPointer( attributes.uv, 2, gl.FLOAT, false, 2 * 8, 8 );

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, elementBuffer );

		gl.disable( gl.CULL_FACE );
		gl.depthMask( false );

		for ( var i = 0, l = flares.length; i < l; i ++ ) {

			size = 16 / viewportHeight;
			scale.set( size * invAspect, size );

			// calc object screen position

			var flare = flares[ i ];
			
			tempPosition.set( flare.matrixWorld.elements[12], flare.matrixWorld.elements[13], flare.matrixWorld.elements[14] );

			tempPosition.applyMatrix4( camera.matrixWorldInverse );
			tempPosition.applyProjection( camera.projectionMatrix );

			// setup arrays for gl programs

			screenPosition.copy( tempPosition )

			screenPositionPixels.x = screenPosition.x * halfViewportWidth + halfViewportWidth;
			screenPositionPixels.y = screenPosition.y * halfViewportHeight + halfViewportHeight;

			// screen cull

			if ( hasVertexTexture || (
				screenPositionPixels.x > 0 &&
				screenPositionPixels.x < viewportWidth &&
				screenPositionPixels.y > 0 &&
				screenPositionPixels.y < viewportHeight ) ) {

				// save current RGB to temp texture

				gl.activeTexture( gl.TEXTURE1 );
				gl.bindTexture( gl.TEXTURE_2D, tempTexture );
				gl.copyTexImage2D( gl.TEXTURE_2D, 0, gl.RGB, screenPositionPixels.x - 8, screenPositionPixels.y - 8, 16, 16, 0 );


				// render pink quad

				gl.uniform1i( uniforms.renderType, 0 );
				gl.uniform2f( uniforms.scale, scale.x, scale.y );
				gl.uniform3f( uniforms.screenPosition, screenPosition.x, screenPosition.y, screenPosition.z );

				gl.disable( gl.BLEND );
				gl.enable( gl.DEPTH_TEST );

				gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );


				// copy result to occlusionMap

				gl.activeTexture( gl.TEXTURE0 );
				gl.bindTexture( gl.TEXTURE_2D, occlusionTexture );
				gl.copyTexImage2D( gl.TEXTURE_2D, 0, gl.RGBA, screenPositionPixels.x - 8, screenPositionPixels.y - 8, 16, 16, 0 );


				// restore graphics

				gl.uniform1i( uniforms.renderType, 1 );
				gl.disable( gl.DEPTH_TEST );

				gl.activeTexture( gl.TEXTURE1 );
				gl.bindTexture( gl.TEXTURE_2D, tempTexture );
				gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );


				// update object positions

				flare.positionScreen.copy( screenPosition )

				if ( flare.customUpdateCallback ) {

					flare.customUpdateCallback( flare );

				} else {

					flare.updateLensFlares();

				}

				// render flares

				gl.uniform1i( uniforms.renderType, 2 );
				gl.enable( gl.BLEND );

				for ( var j = 0, jl = flare.lensFlares.length; j < jl; j ++ ) {

					var sprite = flare.lensFlares[ j ];

					if ( sprite.opacity > 0.001 && sprite.scale > 0.001 ) {

						screenPosition.x = sprite.x;
						screenPosition.y = sprite.y;
						screenPosition.z = sprite.z;

						size = sprite.size * sprite.scale / viewportHeight;

						scale.x = size * invAspect;
						scale.y = size;

						gl.uniform3f( uniforms.screenPosition, screenPosition.x, screenPosition.y, screenPosition.z );
						gl.uniform2f( uniforms.scale, scale.x, scale.y );
						gl.uniform1f( uniforms.rotation, sprite.rotation );

						gl.uniform1f( uniforms.opacity, sprite.opacity );
						gl.uniform3f( uniforms.color, sprite.color.r, sprite.color.g, sprite.color.b );

						renderer.setBlending( sprite.blending, sprite.blendEquation, sprite.blendSrc, sprite.blendDst );
						renderer.setTexture( sprite.texture, 1 );

						gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );

					}

				}

			}

		}

		// restore gl

		gl.enable( gl.CULL_FACE );
		gl.enable( gl.DEPTH_TEST );
		gl.depthMask( true );

		renderer.resetGLState();

	};

	function createProgram ( shader ) {

		var program = gl.createProgram();

		var fragmentShader = gl.createShader( gl.FRAGMENT_SHADER );
		var vertexShader = gl.createShader( gl.VERTEX_SHADER );

		var prefix = "precision " + renderer.getPrecision() + " float;\n";

		gl.shaderSource( fragmentShader, prefix + shader.fragmentShader );
		gl.shaderSource( vertexShader, prefix + shader.vertexShader );

		gl.compileShader( fragmentShader );
		gl.compileShader( vertexShader );

		gl.attachShader( program, fragmentShader );
		gl.attachShader( program, vertexShader );

		gl.linkProgram( program );

		return program;

	}

};

// File:src/renderers/webgl/plugins/ShadowMapPlugin.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ShadowMapPlugin = function ( _renderer, _lights, _webglObjects, _webglObjectsImmediate ) {

	var _gl = _renderer.context;

	var _depthMaterial, _depthMaterialMorph, _depthMaterialSkin, _depthMaterialMorphSkin,

	_frustum = new THREE.Frustum(),
	_projScreenMatrix = new THREE.Matrix4(),

	_min = new THREE.Vector3(),
	_max = new THREE.Vector3(),

	_matrixPosition = new THREE.Vector3(),
	
	_renderList = [];

	// init

	var depthShader = THREE.ShaderLib[ "depthRGBA" ];
	var depthUniforms = THREE.UniformsUtils.clone( depthShader.uniforms );

	_depthMaterial = new THREE.ShaderMaterial( {
		uniforms: depthUniforms,
		vertexShader: depthShader.vertexShader,
		fragmentShader: depthShader.fragmentShader
	 } );

	_depthMaterialMorph = new THREE.ShaderMaterial( {
		uniforms: depthUniforms,
		vertexShader: depthShader.vertexShader,
		fragmentShader: depthShader.fragmentShader,
		morphTargets: true
	} );

	_depthMaterialSkin = new THREE.ShaderMaterial( {
		uniforms: depthUniforms,
		vertexShader: depthShader.vertexShader,
		fragmentShader: depthShader.fragmentShader,
		skinning: true
	} );

	_depthMaterialMorphSkin = new THREE.ShaderMaterial( {
		uniforms: depthUniforms,
		vertexShader: depthShader.vertexShader,
		fragmentShader: depthShader.fragmentShader,
		morphTargets: true,
		skinning: true
	} );

	_depthMaterial._shadowPass = true;
	_depthMaterialMorph._shadowPass = true;
	_depthMaterialSkin._shadowPass = true;
	_depthMaterialMorphSkin._shadowPass = true;

	this.render = function ( scene, camera ) {

		if ( _renderer.shadowMapEnabled === false ) return;

		var i, il, j, jl, n,

		shadowMap, shadowMatrix, shadowCamera,
		program, buffer, material,
		webglObject, object, light,

		lights = [],
		k = 0,

		fog = null;

		// set GL state for depth map

		_gl.clearColor( 1, 1, 1, 1 );
		_gl.disable( _gl.BLEND );

		_gl.enable( _gl.CULL_FACE );
		_gl.frontFace( _gl.CCW );

		if ( _renderer.shadowMapCullFace === THREE.CullFaceFront ) {

			_gl.cullFace( _gl.FRONT );

		} else {

			_gl.cullFace( _gl.BACK );

		}

		_renderer.setDepthTest( true );

		// preprocess lights
		// 	- skip lights that are not casting shadows
		//	- create virtual lights for cascaded shadow maps

		for ( i = 0, il = _lights.length; i < il; i ++ ) {

			light = _lights[ i ];

			if ( ! light.castShadow ) continue;

			if ( ( light instanceof THREE.DirectionalLight ) && light.shadowCascade ) {

				for ( n = 0; n < light.shadowCascadeCount; n ++ ) {

					var virtualLight;

					if ( ! light.shadowCascadeArray[ n ] ) {

						virtualLight = createVirtualLight( light, n );
						virtualLight.originalCamera = camera;

						var gyro = new THREE.Gyroscope();
						gyro.position.copy( light.shadowCascadeOffset );

						gyro.add( virtualLight );
						gyro.add( virtualLight.target );

						camera.add( gyro );

						light.shadowCascadeArray[ n ] = virtualLight;

						console.log( "Created virtualLight", virtualLight );

					} else {

						virtualLight = light.shadowCascadeArray[ n ];

					}

					updateVirtualLight( light, n );

					lights[ k ] = virtualLight;
					k ++;

				}

			} else {

				lights[ k ] = light;
				k ++;

			}

		}

		// render depth map

		for ( i = 0, il = lights.length; i < il; i ++ ) {

			light = lights[ i ];

			if ( ! light.shadowMap ) {

				var shadowFilter = THREE.LinearFilter;

				if ( _renderer.shadowMapType === THREE.PCFSoftShadowMap ) {

					shadowFilter = THREE.NearestFilter;

				}

				var pars = { minFilter: shadowFilter, magFilter: shadowFilter, format: THREE.RGBAFormat };

				light.shadowMap = new THREE.WebGLRenderTarget( light.shadowMapWidth, light.shadowMapHeight, pars );
				light.shadowMapSize = new THREE.Vector2( light.shadowMapWidth, light.shadowMapHeight );

				light.shadowMatrix = new THREE.Matrix4();

			}

			if ( ! light.shadowCamera ) {

				if ( light instanceof THREE.SpotLight ) {

					light.shadowCamera = new THREE.PerspectiveCamera( light.shadowCameraFov, light.shadowMapWidth / light.shadowMapHeight, light.shadowCameraNear, light.shadowCameraFar );

				} else if ( light instanceof THREE.DirectionalLight ) {

					light.shadowCamera = new THREE.OrthographicCamera( light.shadowCameraLeft, light.shadowCameraRight, light.shadowCameraTop, light.shadowCameraBottom, light.shadowCameraNear, light.shadowCameraFar );

				} else {

					console.error( "Unsupported light type for shadow" );
					continue;

				}

				scene.add( light.shadowCamera );

				if ( scene.autoUpdate === true ) scene.updateMatrixWorld();

			}

			if ( light.shadowCameraVisible && ! light.cameraHelper ) {

				light.cameraHelper = new THREE.CameraHelper( light.shadowCamera );
				scene.add( light.cameraHelper );

			}

			if ( light.isVirtual && virtualLight.originalCamera == camera ) {

				updateShadowCamera( camera, light );

			}

			shadowMap = light.shadowMap;
			shadowMatrix = light.shadowMatrix;
			shadowCamera = light.shadowCamera;

			//

			shadowCamera.position.setFromMatrixPosition( light.matrixWorld );
			_matrixPosition.setFromMatrixPosition( light.target.matrixWorld );
			shadowCamera.lookAt( _matrixPosition );
			shadowCamera.updateMatrixWorld();

			shadowCamera.matrixWorldInverse.getInverse( shadowCamera.matrixWorld );

			//

			if ( light.cameraHelper ) light.cameraHelper.visible = light.shadowCameraVisible;
			if ( light.shadowCameraVisible ) light.cameraHelper.update();

			// compute shadow matrix

			shadowMatrix.set(
				0.5, 0.0, 0.0, 0.5,
				0.0, 0.5, 0.0, 0.5,
				0.0, 0.0, 0.5, 0.5,
				0.0, 0.0, 0.0, 1.0
			);

			shadowMatrix.multiply( shadowCamera.projectionMatrix );
			shadowMatrix.multiply( shadowCamera.matrixWorldInverse );

			// update camera matrices and frustum

			_projScreenMatrix.multiplyMatrices( shadowCamera.projectionMatrix, shadowCamera.matrixWorldInverse );
			_frustum.setFromMatrix( _projScreenMatrix );

			// render shadow map

			_renderer.setRenderTarget( shadowMap );
			_renderer.clear();

			// set object matrices & frustum culling

			_renderList.length = 0;

			projectObject( scene, scene, shadowCamera );


			// render regular objects

			var objectMaterial, useMorphing, useSkinning;

			for ( j = 0, jl = _renderList.length; j < jl; j ++ ) {

				webglObject = _renderList[ j ];

				object = webglObject.object;
				buffer = webglObject.buffer;

				// culling is overriden globally for all objects
				// while rendering depth map

				// need to deal with MeshFaceMaterial somehow
				// in that case just use the first of material.materials for now
				// (proper solution would require to break objects by materials
				//  similarly to regular rendering and then set corresponding
				//  depth materials per each chunk instead of just once per object)

				objectMaterial = getObjectMaterial( object );

				useMorphing = object.geometry.morphTargets !== undefined && object.geometry.morphTargets.length > 0 && objectMaterial.morphTargets;
				useSkinning = object instanceof THREE.SkinnedMesh && objectMaterial.skinning;

				if ( object.customDepthMaterial ) {

					material = object.customDepthMaterial;

				} else if ( useSkinning ) {

					material = useMorphing ? _depthMaterialMorphSkin : _depthMaterialSkin;

				} else if ( useMorphing ) {

					material = _depthMaterialMorph;

				} else {

					material = _depthMaterial;

				}

				_renderer.setMaterialFaces( objectMaterial );

				if ( buffer instanceof THREE.BufferGeometry ) {

					_renderer.renderBufferDirect( shadowCamera, _lights, fog, material, buffer, object );

				} else {

					_renderer.renderBuffer( shadowCamera, _lights, fog, material, buffer, object );

				}

			}

			// set matrices and render immediate objects

			for ( j = 0, jl = _webglObjectsImmediate.length; j < jl; j ++ ) {

				webglObject = _webglObjectsImmediate[ j ];
				object = webglObject.object;

				if ( object.visible && object.castShadow ) {

					object._modelViewMatrix.multiplyMatrices( shadowCamera.matrixWorldInverse, object.matrixWorld );

					_renderer.renderImmediateObject( shadowCamera, _lights, fog, _depthMaterial, object );

				}

			}

		}

		// restore GL state

		var clearColor = _renderer.getClearColor(),
		clearAlpha = _renderer.getClearAlpha();

		_gl.clearColor( clearColor.r, clearColor.g, clearColor.b, clearAlpha );
		_gl.enable( _gl.BLEND );

		if ( _renderer.shadowMapCullFace === THREE.CullFaceFront ) {

			_gl.cullFace( _gl.BACK );

		}

		_renderer.resetGLState();

	};

	function projectObject( scene, object, shadowCamera ){

		if ( object.visible ) {

			var webglObjects = _webglObjects[ object.id ];

			if ( webglObjects && object.castShadow && (object.frustumCulled === false || _frustum.intersectsObject( object ) === true) ) {

				for ( var i = 0, l = webglObjects.length; i < l; i ++ ) {

					var webglObject = webglObjects[ i ];

					object._modelViewMatrix.multiplyMatrices( shadowCamera.matrixWorldInverse, object.matrixWorld );
					_renderList.push( webglObject );

				}

			}

			for ( var i = 0, l = object.children.length; i < l; i ++ ) {

				projectObject( scene, object.children[ i ], shadowCamera );

			}

		}

	}

	function createVirtualLight( light, cascade ) {

		var virtualLight = new THREE.DirectionalLight();

		virtualLight.isVirtual = true;

		virtualLight.onlyShadow = true;
		virtualLight.castShadow = true;

		virtualLight.shadowCameraNear = light.shadowCameraNear;
		virtualLight.shadowCameraFar = light.shadowCameraFar;

		virtualLight.shadowCameraLeft = light.shadowCameraLeft;
		virtualLight.shadowCameraRight = light.shadowCameraRight;
		virtualLight.shadowCameraBottom = light.shadowCameraBottom;
		virtualLight.shadowCameraTop = light.shadowCameraTop;

		virtualLight.shadowCameraVisible = light.shadowCameraVisible;

		virtualLight.shadowDarkness = light.shadowDarkness;

		virtualLight.shadowBias = light.shadowCascadeBias[ cascade ];
		virtualLight.shadowMapWidth = light.shadowCascadeWidth[ cascade ];
		virtualLight.shadowMapHeight = light.shadowCascadeHeight[ cascade ];

		virtualLight.pointsWorld = [];
		virtualLight.pointsFrustum = [];

		var pointsWorld = virtualLight.pointsWorld,
			pointsFrustum = virtualLight.pointsFrustum;

		for ( var i = 0; i < 8; i ++ ) {

			pointsWorld[ i ] = new THREE.Vector3();
			pointsFrustum[ i ] = new THREE.Vector3();

		}

		var nearZ = light.shadowCascadeNearZ[ cascade ];
		var farZ = light.shadowCascadeFarZ[ cascade ];

		pointsFrustum[ 0 ].set( - 1, - 1, nearZ );
		pointsFrustum[ 1 ].set(  1, - 1, nearZ );
		pointsFrustum[ 2 ].set( - 1,  1, nearZ );
		pointsFrustum[ 3 ].set(  1,  1, nearZ );

		pointsFrustum[ 4 ].set( - 1, - 1, farZ );
		pointsFrustum[ 5 ].set(  1, - 1, farZ );
		pointsFrustum[ 6 ].set( - 1,  1, farZ );
		pointsFrustum[ 7 ].set(  1,  1, farZ );

		return virtualLight;

	}

	// Synchronize virtual light with the original light

	function updateVirtualLight( light, cascade ) {

		var virtualLight = light.shadowCascadeArray[ cascade ];

		virtualLight.position.copy( light.position );
		virtualLight.target.position.copy( light.target.position );
		virtualLight.lookAt( virtualLight.target );

		virtualLight.shadowCameraVisible = light.shadowCameraVisible;
		virtualLight.shadowDarkness = light.shadowDarkness;

		virtualLight.shadowBias = light.shadowCascadeBias[ cascade ];

		var nearZ = light.shadowCascadeNearZ[ cascade ];
		var farZ = light.shadowCascadeFarZ[ cascade ];

		var pointsFrustum = virtualLight.pointsFrustum;

		pointsFrustum[ 0 ].z = nearZ;
		pointsFrustum[ 1 ].z = nearZ;
		pointsFrustum[ 2 ].z = nearZ;
		pointsFrustum[ 3 ].z = nearZ;

		pointsFrustum[ 4 ].z = farZ;
		pointsFrustum[ 5 ].z = farZ;
		pointsFrustum[ 6 ].z = farZ;
		pointsFrustum[ 7 ].z = farZ;

	}

	// Fit shadow camera's ortho frustum to camera frustum

	function updateShadowCamera( camera, light ) {

		var shadowCamera = light.shadowCamera,
			pointsFrustum = light.pointsFrustum,
			pointsWorld = light.pointsWorld;

		_min.set( Infinity, Infinity, Infinity );
		_max.set( - Infinity, - Infinity, - Infinity );

		for ( var i = 0; i < 8; i ++ ) {

			var p = pointsWorld[ i ];

			p.copy( pointsFrustum[ i ] );
			p.unproject( camera );

			p.applyMatrix4( shadowCamera.matrixWorldInverse );

			if ( p.x < _min.x ) _min.x = p.x;
			if ( p.x > _max.x ) _max.x = p.x;

			if ( p.y < _min.y ) _min.y = p.y;
			if ( p.y > _max.y ) _max.y = p.y;

			if ( p.z < _min.z ) _min.z = p.z;
			if ( p.z > _max.z ) _max.z = p.z;

		}

		shadowCamera.left = _min.x;
		shadowCamera.right = _max.x;
		shadowCamera.top = _max.y;
		shadowCamera.bottom = _min.y;

		// can't really fit near/far
		//shadowCamera.near = _min.z;
		//shadowCamera.far = _max.z;

		shadowCamera.updateProjectionMatrix();

	}

	// For the moment just ignore objects that have multiple materials with different animation methods
	// Only the first material will be taken into account for deciding which depth material to use for shadow maps

	function getObjectMaterial( object ) {

		return object.material instanceof THREE.MeshFaceMaterial
			? object.material.materials[ 0 ]
			: object.material;

	};

};

// File:src/renderers/webgl/plugins/SpritePlugin.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.SpritePlugin = function ( renderer, sprites ) {

	var gl = renderer.context;

	var vertexBuffer, elementBuffer;
	var program, attributes, uniforms;

	var texture;
	
	var init = function () {

		var vertices = new Float32Array( [
			- 0.5, - 0.5,  0, 0,
			  0.5, - 0.5,  1, 0,
			  0.5,   0.5,  1, 1,
			- 0.5,   0.5,  0, 1
		] );

		var faces = new Uint16Array( [
			0, 1, 2,
			0, 2, 3
		] );

		vertexBuffer  = gl.createBuffer();
		elementBuffer = gl.createBuffer();

		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, elementBuffer );
		gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW );

		program = createProgram();

		attributes = {
			position:			gl.getAttribLocation ( program, 'position' ),
			uv:					gl.getAttribLocation ( program, 'uv' )
		};

		uniforms = {
			uvOffset:			gl.getUniformLocation( program, 'uvOffset' ),
			uvScale:			gl.getUniformLocation( program, 'uvScale' ),

			rotation:			gl.getUniformLocation( program, 'rotation' ),
			scale:				gl.getUniformLocation( program, 'scale' ),

			color:				gl.getUniformLocation( program, 'color' ),
			map:				gl.getUniformLocation( program, 'map' ),
			opacity:			gl.getUniformLocation( program, 'opacity' ),

			modelViewMatrix: 	gl.getUniformLocation( program, 'modelViewMatrix' ),
			projectionMatrix:	gl.getUniformLocation( program, 'projectionMatrix' ),

			fogType:			gl.getUniformLocation( program, 'fogType' ),
			fogDensity:			gl.getUniformLocation( program, 'fogDensity' ),
			fogNear:			gl.getUniformLocation( program, 'fogNear' ),
			fogFar:				gl.getUniformLocation( program, 'fogFar' ),
			fogColor:			gl.getUniformLocation( program, 'fogColor' ),

			alphaTest:			gl.getUniformLocation( program, 'alphaTest' )
		};

		var canvas = document.createElement( 'canvas' );
		canvas.width = 8;
		canvas.height = 8;

		var context = canvas.getContext( '2d' );
		context.fillStyle = 'white';
		context.fillRect( 0, 0, 8, 8 );

		texture = new THREE.Texture( canvas );
		texture.needsUpdate = true;

	};

	this.render = function ( scene, camera ) {

		if ( sprites.length === 0 ) return;

		// setup gl

		if ( program === undefined ) {

			init();

		}

		gl.useProgram( program );

		gl.enableVertexAttribArray( attributes.position );
		gl.enableVertexAttribArray( attributes.uv );

		gl.disable( gl.CULL_FACE );
		gl.enable( gl.BLEND );

		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
		gl.vertexAttribPointer( attributes.position, 2, gl.FLOAT, false, 2 * 8, 0 );
		gl.vertexAttribPointer( attributes.uv, 2, gl.FLOAT, false, 2 * 8, 8 );

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, elementBuffer );

		gl.uniformMatrix4fv( uniforms.projectionMatrix, false, camera.projectionMatrix.elements );

		gl.activeTexture( gl.TEXTURE0 );
		gl.uniform1i( uniforms.map, 0 );

		var oldFogType = 0;
		var sceneFogType = 0;
		var fog = scene.fog;

		if ( fog ) {

			gl.uniform3f( uniforms.fogColor, fog.color.r, fog.color.g, fog.color.b );

			if ( fog instanceof THREE.Fog ) {

				gl.uniform1f( uniforms.fogNear, fog.near );
				gl.uniform1f( uniforms.fogFar, fog.far );

				gl.uniform1i( uniforms.fogType, 1 );
				oldFogType = 1;
				sceneFogType = 1;

			} else if ( fog instanceof THREE.FogExp2 ) {

				gl.uniform1f( uniforms.fogDensity, fog.density );

				gl.uniform1i( uniforms.fogType, 2 );
				oldFogType = 2;
				sceneFogType = 2;

			}

		} else {

			gl.uniform1i( uniforms.fogType, 0 );
			oldFogType = 0;
			sceneFogType = 0;

		}


		// update positions and sort

		for ( var i = 0, l = sprites.length; i < l; i ++ ) {

			var sprite = sprites[ i ];

			sprite._modelViewMatrix.multiplyMatrices( camera.matrixWorldInverse, sprite.matrixWorld );

			if ( sprite.renderDepth === null ) {

				sprite.z = - sprite._modelViewMatrix.elements[ 14 ];

			} else {

				sprite.z = sprite.renderDepth;

			}

		}

		sprites.sort( painterSortStable );

		// render all sprites

		var scale = [];

		for ( var i = 0, l = sprites.length; i < l; i ++ ) {

			var sprite = sprites[ i ];
			var material = sprite.material;

			gl.uniform1f( uniforms.alphaTest, material.alphaTest );
			gl.uniformMatrix4fv( uniforms.modelViewMatrix, false, sprite._modelViewMatrix.elements );

			scale[ 0 ] = sprite.scale.x;
			scale[ 1 ] = sprite.scale.y;

			var fogType = 0;

			if ( scene.fog && material.fog ) {

				fogType = sceneFogType;

			}

			if ( oldFogType !== fogType ) {

				gl.uniform1i( uniforms.fogType, fogType );
				oldFogType = fogType;

			}

			if ( material.map !== null ) {

				gl.uniform2f( uniforms.uvOffset, material.map.offset.x, material.map.offset.y );
				gl.uniform2f( uniforms.uvScale, material.map.repeat.x, material.map.repeat.y );

			} else {

				gl.uniform2f( uniforms.uvOffset, 0, 0 );
				gl.uniform2f( uniforms.uvScale, 1, 1 );

			}

			gl.uniform1f( uniforms.opacity, material.opacity );
			gl.uniform3f( uniforms.color, material.color.r, material.color.g, material.color.b );

			gl.uniform1f( uniforms.rotation, material.rotation );
			gl.uniform2fv( uniforms.scale, scale );

			renderer.setBlending( material.blending, material.blendEquation, material.blendSrc, material.blendDst );
			renderer.setDepthTest( material.depthTest );
			renderer.setDepthWrite( material.depthWrite );

			if ( material.map && material.map.image && material.map.image.width ) {

				renderer.setTexture( material.map, 0 );

			} else {

				renderer.setTexture( texture, 0 );

			}

			gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );

		}

		// restore gl

		gl.enable( gl.CULL_FACE );
		
		renderer.resetGLState();

	};

	function createProgram () {

		var program = gl.createProgram();

		var vertexShader = gl.createShader( gl.VERTEX_SHADER );
		var fragmentShader = gl.createShader( gl.FRAGMENT_SHADER );

		gl.shaderSource( vertexShader, [

			'precision ' + renderer.getPrecision() + ' float;',

			'uniform mat4 modelViewMatrix;',
			'uniform mat4 projectionMatrix;',
			'uniform float rotation;',
			'uniform vec2 scale;',
			'uniform vec2 uvOffset;',
			'uniform vec2 uvScale;',

			'attribute vec2 position;',
			'attribute vec2 uv;',

			'varying vec2 vUV;',

			'void main() {',

				'vUV = uvOffset + uv * uvScale;',

				'vec2 alignedPosition = position * scale;',

				'vec2 rotatedPosition;',
				'rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;',
				'rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;',

				'vec4 finalPosition;',

				'finalPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );',
				'finalPosition.xy += rotatedPosition;',
				'finalPosition = projectionMatrix * finalPosition;',

				'gl_Position = finalPosition;',

			'}'

		].join( '\n' ) );

		gl.shaderSource( fragmentShader, [

			'precision ' + renderer.getPrecision() + ' float;',

			'uniform vec3 color;',
			'uniform sampler2D map;',
			'uniform float opacity;',

			'uniform int fogType;',
			'uniform vec3 fogColor;',
			'uniform float fogDensity;',
			'uniform float fogNear;',
			'uniform float fogFar;',
			'uniform float alphaTest;',

			'varying vec2 vUV;',

			'void main() {',

				'vec4 texture = texture2D( map, vUV );',

				'if ( texture.a < alphaTest ) discard;',

				'gl_FragColor = vec4( color * texture.xyz, texture.a * opacity );',

				'if ( fogType > 0 ) {',

					'float depth = gl_FragCoord.z / gl_FragCoord.w;',
					'float fogFactor = 0.0;',

					'if ( fogType == 1 ) {',

						'fogFactor = smoothstep( fogNear, fogFar, depth );',

					'} else {',

						'const float LOG2 = 1.442695;',
						'float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );',
						'fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );',

					'}',

					'gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );',

				'}',

			'}'

		].join( '\n' ) );

		gl.compileShader( vertexShader );
		gl.compileShader( fragmentShader );

		gl.attachShader( program, vertexShader );
		gl.attachShader( program, fragmentShader );

		gl.linkProgram( program );

		return program;

	};

	function painterSortStable ( a, b ) {

		if ( a.z !== b.z ) {

			return b.z - a.z;

		} else {

			return b.id - a.id;

		}

	};

};

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.BinaryLoader = function ( showStatus ) {

	THREE.Loader.call( this, showStatus );

};

THREE.BinaryLoader.prototype = Object.create( THREE.Loader.prototype );

// Load models generated by slim OBJ converter with BINARY option (converter_obj_three_slim.py -t binary)
//  - binary models consist of two files: JS and BIN
//  - parameters
//		- url (required)
//		- callback (required)
//		- texturePath (optional: if not specified, textures will be assumed to be in the same folder as JS model file)
//		- binaryPath (optional: if not specified, binary file will be assumed to be in the same folder as JS model file)

THREE.BinaryLoader.prototype.load = function ( url, callback, texturePath, binaryPath, progressCB ) {

	// todo: unify load API to for easier SceneLoader use

	texturePath = texturePath || this.extractUrlBase( url );
	binaryPath = binaryPath || this.extractUrlBase( url );

	var callbackProgress = progressCB;

	this.onLoadStart();

	// #1 load JS part via web worker

	this.loadAjaxJSON( this, url, callback, texturePath, binaryPath, callbackProgress );

};

THREE.BinaryLoader.prototype.loadAjaxJSON = function ( context, url, callback, texturePath, binaryPath, callbackProgress ) {

	var xhr = new XMLHttpRequest();

	texturePath = texturePath && ( typeof texturePath === "string" ) ? texturePath : this.extractUrlBase( url );
	binaryPath = binaryPath && ( typeof binaryPath === "string" ) ? binaryPath : this.extractUrlBase( url );

	xhr.onreadystatechange = function () {

		if ( xhr.readyState == 4 ) {

			if ( xhr.status == 200 || xhr.status == 0 ) {

				var json = JSON.parse( xhr.responseText );
				context.loadAjaxBuffers( json, callback, binaryPath, texturePath, callbackProgress );

			} else {

				console.error( "THREE.BinaryLoader: Couldn't load [" + url + "] [" + xhr.status + "]" );

			}

		}

	};

	xhr.open( "GET", url, true );
	xhr.send( null );

};

THREE.BinaryLoader.prototype.loadAjaxBuffers = function ( json, callback, binaryPath, texturePath, callbackProgress ) {

	var xhr = new XMLHttpRequest(),
		url = binaryPath + json.buffers;

	xhr.addEventListener( 'load', function ( event ) {

		var buffer = xhr.response;

		if ( buffer === undefined ) {

			// IEWEBGL needs this
			buffer = ( new Uint8Array( xhr.responseBody ) ).buffer;

		}

		if ( buffer.byteLength == 0 ) {  // iOS and other XMLHttpRequest level 1

			var buffer = new ArrayBuffer( xhr.responseText.length );

			var bufView = new Uint8Array( buffer );

			for ( var i = 0, l = xhr.responseText.length; i < l; i ++ ) {

				bufView[ i ] = xhr.responseText.charCodeAt( i ) & 0xff;

			}

		}

		THREE.BinaryLoader.prototype.createBinModel( buffer, callback, texturePath, json.materials );

	}, false );

	if ( callbackProgress !== undefined ) {

		xhr.addEventListener( 'progress', function ( event ) {

			if ( event.lengthComputable ) {

				callbackProgress( event );

			}

		}, false );

	}

	xhr.addEventListener( 'error', function ( event ) {

		console.error( "THREE.BinaryLoader: Couldn't load [" + url + "] [" + xhr.status + "]" );

	}, false );


	xhr.open( "GET", url, true );
	xhr.responseType = "arraybuffer";
	if ( xhr.overrideMimeType ) xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
	xhr.send( null );

};

// Binary AJAX parser

THREE.BinaryLoader.prototype.createBinModel = function ( data, callback, texturePath, jsonMaterials ) {

	var Model = function ( texturePath ) {

		var scope = this,
			currentOffset = 0,
			md,
			normals = [],
			uvs = [],
			start_tri_flat, start_tri_smooth, start_tri_flat_uv, start_tri_smooth_uv,
			start_quad_flat, start_quad_smooth, start_quad_flat_uv, start_quad_smooth_uv,
			tri_size, quad_size,
			len_tri_flat, len_tri_smooth, len_tri_flat_uv, len_tri_smooth_uv,
			len_quad_flat, len_quad_smooth, len_quad_flat_uv, len_quad_smooth_uv;


		THREE.Geometry.call( this );

		md = parseMetaData( data, currentOffset );

		currentOffset += md.header_bytes;
/*
		md.vertex_index_bytes = Uint32Array.BYTES_PER_ELEMENT;
		md.material_index_bytes = Uint16Array.BYTES_PER_ELEMENT;
		md.normal_index_bytes = Uint32Array.BYTES_PER_ELEMENT;
		md.uv_index_bytes = Uint32Array.BYTES_PER_ELEMENT;
*/
		// buffers sizes

		tri_size =  md.vertex_index_bytes * 3 + md.material_index_bytes;
		quad_size = md.vertex_index_bytes * 4 + md.material_index_bytes;

		len_tri_flat      = md.ntri_flat      * ( tri_size );
		len_tri_smooth    = md.ntri_smooth    * ( tri_size + md.normal_index_bytes * 3 );
		len_tri_flat_uv   = md.ntri_flat_uv   * ( tri_size + md.uv_index_bytes * 3 );
		len_tri_smooth_uv = md.ntri_smooth_uv * ( tri_size + md.normal_index_bytes * 3 + md.uv_index_bytes * 3 );

		len_quad_flat      = md.nquad_flat      * ( quad_size );
		len_quad_smooth    = md.nquad_smooth    * ( quad_size + md.normal_index_bytes * 4 );
		len_quad_flat_uv   = md.nquad_flat_uv   * ( quad_size + md.uv_index_bytes * 4 );
		len_quad_smooth_uv = md.nquad_smooth_uv * ( quad_size + md.normal_index_bytes * 4 + md.uv_index_bytes * 4 );

		// read buffers

		currentOffset += init_vertices( currentOffset );

		currentOffset += init_normals( currentOffset );
		currentOffset += handlePadding( md.nnormals * 3 );

		currentOffset += init_uvs( currentOffset );

		start_tri_flat 		= currentOffset;
		start_tri_smooth    = start_tri_flat    + len_tri_flat    + handlePadding( md.ntri_flat * 2 );
		start_tri_flat_uv   = start_tri_smooth  + len_tri_smooth  + handlePadding( md.ntri_smooth * 2 );
		start_tri_smooth_uv = start_tri_flat_uv + len_tri_flat_uv + handlePadding( md.ntri_flat_uv * 2 );

		start_quad_flat     = start_tri_smooth_uv + len_tri_smooth_uv  + handlePadding( md.ntri_smooth_uv * 2 );
		start_quad_smooth   = start_quad_flat     + len_quad_flat	   + handlePadding( md.nquad_flat * 2 );
		start_quad_flat_uv  = start_quad_smooth   + len_quad_smooth    + handlePadding( md.nquad_smooth * 2 );
		start_quad_smooth_uv= start_quad_flat_uv  + len_quad_flat_uv   + handlePadding( md.nquad_flat_uv * 2 );

		// have to first process faces with uvs
		// so that face and uv indices match

		init_triangles_flat_uv( start_tri_flat_uv );
		init_triangles_smooth_uv( start_tri_smooth_uv );

		init_quads_flat_uv( start_quad_flat_uv );
		init_quads_smooth_uv( start_quad_smooth_uv );

		// now we can process untextured faces

		init_triangles_flat( start_tri_flat );
		init_triangles_smooth( start_tri_smooth );

		init_quads_flat( start_quad_flat );
		init_quads_smooth( start_quad_smooth );

		this.computeCentroids();
		this.computeFaceNormals();

		function handlePadding( n ) {

			return ( n % 4 ) ? ( 4 - n % 4 ) : 0;

		};

		function parseMetaData( data, offset ) {

			var metaData = {

				'signature'               :parseString( data, offset,  12 ),
				'header_bytes'            :parseUChar8( data, offset + 12 ),

				'vertex_coordinate_bytes' :parseUChar8( data, offset + 13 ),
				'normal_coordinate_bytes' :parseUChar8( data, offset + 14 ),
				'uv_coordinate_bytes'     :parseUChar8( data, offset + 15 ),

				'vertex_index_bytes'      :parseUChar8( data, offset + 16 ),
				'normal_index_bytes'      :parseUChar8( data, offset + 17 ),
				'uv_index_bytes'          :parseUChar8( data, offset + 18 ),
				'material_index_bytes'    :parseUChar8( data, offset + 19 ),

				'nvertices'    :parseUInt32( data, offset + 20 ),
				'nnormals'     :parseUInt32( data, offset + 20 + 4*1 ),
				'nuvs'         :parseUInt32( data, offset + 20 + 4*2 ),

				'ntri_flat'      :parseUInt32( data, offset + 20 + 4*3 ),
				'ntri_smooth'    :parseUInt32( data, offset + 20 + 4*4 ),
				'ntri_flat_uv'   :parseUInt32( data, offset + 20 + 4*5 ),
				'ntri_smooth_uv' :parseUInt32( data, offset + 20 + 4*6 ),

				'nquad_flat'      :parseUInt32( data, offset + 20 + 4*7 ),
				'nquad_smooth'    :parseUInt32( data, offset + 20 + 4*8 ),
				'nquad_flat_uv'   :parseUInt32( data, offset + 20 + 4*9 ),
				'nquad_smooth_uv' :parseUInt32( data, offset + 20 + 4*10 )

			};
/*
			console.log( "signature: " + metaData.signature );

			console.log( "header_bytes: " + metaData.header_bytes );
			console.log( "vertex_coordinate_bytes: " + metaData.vertex_coordinate_bytes );
			console.log( "normal_coordinate_bytes: " + metaData.normal_coordinate_bytes );
			console.log( "uv_coordinate_bytes: " + metaData.uv_coordinate_bytes );

			console.log( "vertex_index_bytes: " + metaData.vertex_index_bytes );
			console.log( "normal_index_bytes: " + metaData.normal_index_bytes );
			console.log( "uv_index_bytes: " + metaData.uv_index_bytes );
			console.log( "material_index_bytes: " + metaData.material_index_bytes );

			console.log( "nvertices: " + metaData.nvertices );
			console.log( "nnormals: " + metaData.nnormals );
			console.log( "nuvs: " + metaData.nuvs );

			console.log( "ntri_flat: " + metaData.ntri_flat );
			console.log( "ntri_smooth: " + metaData.ntri_smooth );
			console.log( "ntri_flat_uv: " + metaData.ntri_flat_uv );
			console.log( "ntri_smooth_uv: " + metaData.ntri_smooth_uv );

			console.log( "nquad_flat: " + metaData.nquad_flat );
			console.log( "nquad_smooth: " + metaData.nquad_smooth );
			console.log( "nquad_flat_uv: " + metaData.nquad_flat_uv );
			console.log( "nquad_smooth_uv: " + metaData.nquad_smooth_uv );

			var total = metaData.header_bytes
					  + metaData.nvertices * metaData.vertex_coordinate_bytes * 3
					  + metaData.nnormals * metaData.normal_coordinate_bytes * 3
					  + metaData.nuvs * metaData.uv_coordinate_bytes * 2
					  + metaData.ntri_flat * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes )
					  + metaData.ntri_smooth * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes + metaData.normal_index_bytes*3 )
					  + metaData.ntri_flat_uv * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes + metaData.uv_index_bytes*3 )
					  + metaData.ntri_smooth_uv * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes + metaData.normal_index_bytes*3 + metaData.uv_index_bytes*3 )
					  + metaData.nquad_flat * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes )
					  + metaData.nquad_smooth * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes + metaData.normal_index_bytes*4 )
					  + metaData.nquad_flat_uv * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes + metaData.uv_index_bytes*4 )
					  + metaData.nquad_smooth_uv * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes + metaData.normal_index_bytes*4 + metaData.uv_index_bytes*4 );
			console.log( "total bytes: " + total );
*/

			return metaData;

		};

		function parseString( data, offset, length ) {

			var charArray = new Uint8Array( data, offset, length );

			var text = "";

			for ( var i = 0; i < length; i ++ ) {

				text += String.fromCharCode( charArray[ offset + i ] );

			}

			return text;

		};

		function parseUChar8( data, offset ) {

			var charArray = new Uint8Array( data, offset, 1 );

			return charArray[ 0 ];

		};

		function parseUInt32( data, offset ) {

			var intArray = new Uint32Array( data, offset, 1 );

			return intArray[ 0 ];

		};

		function init_vertices( start ) {

			var nElements = md.nvertices;

			var coordArray = new Float32Array( data, start, nElements * 3 );

			var i, x, y, z;

			for( i = 0; i < nElements; i ++ ) {

				x = coordArray[ i * 3 ];
				y = coordArray[ i * 3 + 1 ];
				z = coordArray[ i * 3 + 2 ];

				vertex( scope, x, y, z );

			}

			return nElements * 3 * Float32Array.BYTES_PER_ELEMENT;

		};

		function init_normals( start ) {

			var nElements = md.nnormals;

			if ( nElements ) {

				var normalArray = new Int8Array( data, start, nElements * 3 );

				var i, x, y, z;

				for( i = 0; i < nElements; i ++ ) {

					x = normalArray[ i * 3 ];
					y = normalArray[ i * 3 + 1 ];
					z = normalArray[ i * 3 + 2 ];

					normals.push( x/127, y/127, z/127 );

				}

			}

			return nElements * 3 * Int8Array.BYTES_PER_ELEMENT;

		};

		function init_uvs( start ) {

			var nElements = md.nuvs;

			if ( nElements ) {

				var uvArray = new Float32Array( data, start, nElements * 2 );

				var i, u, v;

				for( i = 0; i < nElements; i ++ ) {

					u = uvArray[ i * 2 ];
					v = uvArray[ i * 2 + 1 ];

					uvs.push( u, v );

				}

			}

			return nElements * 2 * Float32Array.BYTES_PER_ELEMENT;

		};

		function init_uvs3( nElements, offset ) {

			var i, uva, uvb, uvc, u1, u2, u3, v1, v2, v3;

			var uvIndexBuffer = new Uint32Array( data, offset, 3 * nElements );

			for( i = 0; i < nElements; i ++ ) {

				uva = uvIndexBuffer[ i * 3 ];
				uvb = uvIndexBuffer[ i * 3 + 1 ];
				uvc = uvIndexBuffer[ i * 3 + 2 ];

				u1 = uvs[ uva*2 ];
				v1 = uvs[ uva*2 + 1 ];

				u2 = uvs[ uvb*2 ];
				v2 = uvs[ uvb*2 + 1 ];

				u3 = uvs[ uvc*2 ];
				v3 = uvs[ uvc*2 + 1 ];

				uv3( scope.faceVertexUvs[ 0 ], u1, v1, u2, v2, u3, v3 );

			}

		};

		function init_uvs4( nElements, offset ) {

			var i, uva, uvb, uvc, uvd, u1, u2, u3, u4, v1, v2, v3, v4;

			var uvIndexBuffer = new Uint32Array( data, offset, 4 * nElements );

			for( i = 0; i < nElements; i ++ ) {

				uva = uvIndexBuffer[ i * 4 ];
				uvb = uvIndexBuffer[ i * 4 + 1 ];
				uvc = uvIndexBuffer[ i * 4 + 2 ];
				uvd = uvIndexBuffer[ i * 4 + 3 ];

				u1 = uvs[ uva*2 ];
				v1 = uvs[ uva*2 + 1 ];

				u2 = uvs[ uvb*2 ];
				v2 = uvs[ uvb*2 + 1 ];

				u3 = uvs[ uvc*2 ];
				v3 = uvs[ uvc*2 + 1 ];

				u4 = uvs[ uvd*2 ];
				v4 = uvs[ uvd*2 + 1 ];

				uv4( scope.faceVertexUvs[ 0 ], u1, v1, u2, v2, u3, v3, u4, v4 );

			}

		};

		function init_faces3_flat( nElements, offsetVertices, offsetMaterials ) {

			var i, a, b, c, m;

			var vertexIndexBuffer = new Uint32Array( data, offsetVertices, 3 * nElements );
			var materialIndexBuffer = new Uint16Array( data, offsetMaterials, nElements );

			for( i = 0; i < nElements; i ++ ) {

				a = vertexIndexBuffer[ i * 3 ];
				b = vertexIndexBuffer[ i * 3 + 1 ];
				c = vertexIndexBuffer[ i * 3 + 2 ];

				m = materialIndexBuffer[ i ];

				f3( scope, a, b, c, m );

			}

		};

		function init_faces4_flat( nElements, offsetVertices, offsetMaterials ) {

			var i, a, b, c, d, m;

			var vertexIndexBuffer = new Uint32Array( data, offsetVertices, 4 * nElements );
			var materialIndexBuffer = new Uint16Array( data, offsetMaterials, nElements );

			for( i = 0; i < nElements; i ++ ) {

				a = vertexIndexBuffer[ i * 4 ];
				b = vertexIndexBuffer[ i * 4 + 1 ];
				c = vertexIndexBuffer[ i * 4 + 2 ];
				d = vertexIndexBuffer[ i * 4 + 3 ];

				m = materialIndexBuffer[ i ];

				f4( scope, a, b, c, d, m );

			}

		};

		function init_faces3_smooth( nElements, offsetVertices, offsetNormals, offsetMaterials ) {

			var i, a, b, c, m;
			var na, nb, nc;

			var vertexIndexBuffer = new Uint32Array( data, offsetVertices, 3 * nElements );
			var normalIndexBuffer = new Uint32Array( data, offsetNormals, 3 * nElements );
			var materialIndexBuffer = new Uint16Array( data, offsetMaterials, nElements );

			for( i = 0; i < nElements; i ++ ) {

				a = vertexIndexBuffer[ i * 3 ];
				b = vertexIndexBuffer[ i * 3 + 1 ];
				c = vertexIndexBuffer[ i * 3 + 2 ];

				na = normalIndexBuffer[ i * 3 ];
				nb = normalIndexBuffer[ i * 3 + 1 ];
				nc = normalIndexBuffer[ i * 3 + 2 ];

				m = materialIndexBuffer[ i ];

				f3n( scope, normals, a, b, c, m, na, nb, nc );

			}

		};

		function init_faces4_smooth( nElements, offsetVertices, offsetNormals, offsetMaterials ) {

			var i, a, b, c, d, m;
			var na, nb, nc, nd;

			var vertexIndexBuffer = new Uint32Array( data, offsetVertices, 4 * nElements );
			var normalIndexBuffer = new Uint32Array( data, offsetNormals, 4 * nElements );
			var materialIndexBuffer = new Uint16Array( data, offsetMaterials, nElements );

			for( i = 0; i < nElements; i ++ ) {

				a = vertexIndexBuffer[ i * 4 ];
				b = vertexIndexBuffer[ i * 4 + 1 ];
				c = vertexIndexBuffer[ i * 4 + 2 ];
				d = vertexIndexBuffer[ i * 4 + 3 ];

				na = normalIndexBuffer[ i * 4 ];
				nb = normalIndexBuffer[ i * 4 + 1 ];
				nc = normalIndexBuffer[ i * 4 + 2 ];
				nd = normalIndexBuffer[ i * 4 + 3 ];

				m = materialIndexBuffer[ i ];

				f4n( scope, normals, a, b, c, d, m, na, nb, nc, nd );

			}

		};

		function init_triangles_flat( start ) {

			var nElements = md.ntri_flat;

			if ( nElements ) {

				var offsetMaterials = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;
				init_faces3_flat( nElements, start, offsetMaterials );

			}

		};

		function init_triangles_flat_uv( start ) {

			var nElements = md.ntri_flat_uv;

			if ( nElements ) {

				var offsetUvs = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;
				var offsetMaterials = offsetUvs + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;

				init_faces3_flat( nElements, start, offsetMaterials );
				init_uvs3( nElements, offsetUvs );

			}

		};

		function init_triangles_smooth( start ) {

			var nElements = md.ntri_smooth;

			if ( nElements ) {

				var offsetNormals = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;
				var offsetMaterials = offsetNormals + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;

				init_faces3_smooth( nElements, start, offsetNormals, offsetMaterials );

			}

		};

		function init_triangles_smooth_uv( start ) {

			var nElements = md.ntri_smooth_uv;

			if ( nElements ) {

				var offsetNormals = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;
				var offsetUvs = offsetNormals + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;
				var offsetMaterials = offsetUvs + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;

				init_faces3_smooth( nElements, start, offsetNormals, offsetMaterials );
				init_uvs3( nElements, offsetUvs );

			}

		};

		function init_quads_flat( start ) {

			var nElements = md.nquad_flat;

			if ( nElements ) {

				var offsetMaterials = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;
				init_faces4_flat( nElements, start, offsetMaterials );

			}

		};

		function init_quads_flat_uv( start ) {

			var nElements = md.nquad_flat_uv;

			if ( nElements ) {

				var offsetUvs = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;
				var offsetMaterials = offsetUvs + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;

				init_faces4_flat( nElements, start, offsetMaterials );
				init_uvs4( nElements, offsetUvs );

			}

		};

		function init_quads_smooth( start ) {

			var nElements = md.nquad_smooth;

			if ( nElements ) {

				var offsetNormals = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;
				var offsetMaterials = offsetNormals + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;

				init_faces4_smooth( nElements, start, offsetNormals, offsetMaterials );

			}

		};

		function init_quads_smooth_uv( start ) {

			var nElements = md.nquad_smooth_uv;

			if ( nElements ) {

				var offsetNormals = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;
				var offsetUvs = offsetNormals + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;
				var offsetMaterials = offsetUvs + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;

				init_faces4_smooth( nElements, start, offsetNormals, offsetMaterials );
				init_uvs4( nElements, offsetUvs );

			}

		};

	};

	function vertex ( scope, x, y, z ) {

		scope.vertices.push( new THREE.Vector3( x, y, z ) );

	};

	function f3 ( scope, a, b, c, mi ) {

		scope.faces.push( new THREE.Face3( a, b, c, null, null, mi ) );

	};

	function f4 ( scope, a, b, c, d, mi ) {

		scope.faces.push( new THREE.Face3( a, b, d, null, null, mi ) );
		scope.faces.push( new THREE.Face3( b, c, d, null, null, mi ) );

	};

	function f3n ( scope, normals, a, b, c, mi, na, nb, nc ) {

		var nax = normals[ na*3     ],
			nay = normals[ na*3 + 1 ],
			naz = normals[ na*3 + 2 ],

			nbx = normals[ nb*3     ],
			nby = normals[ nb*3 + 1 ],
			nbz = normals[ nb*3 + 2 ],

			ncx = normals[ nc*3     ],
			ncy = normals[ nc*3 + 1 ],
			ncz = normals[ nc*3 + 2 ];

		scope.faces.push( new THREE.Face3( a, b, c,
						  [new THREE.Vector3( nax, nay, naz ),
						   new THREE.Vector3( nbx, nby, nbz ),
						   new THREE.Vector3( ncx, ncy, ncz )],
						  null,
						  mi ) );

	};

	function f4n ( scope, normals, a, b, c, d, mi, na, nb, nc, nd ) {

		var nax = normals[ na*3     ],
			nay = normals[ na*3 + 1 ],
			naz = normals[ na*3 + 2 ],

			nbx = normals[ nb*3     ],
			nby = normals[ nb*3 + 1 ],
			nbz = normals[ nb*3 + 2 ],

			ncx = normals[ nc*3     ],
			ncy = normals[ nc*3 + 1 ],
			ncz = normals[ nc*3 + 2 ],

			ndx = normals[ nd*3     ],
			ndy = normals[ nd*3 + 1 ],
			ndz = normals[ nd*3 + 2 ];

		scope.faces.push( new THREE.Face3( a, b, d, [
			new THREE.Vector3( nax, nay, naz ),
			new THREE.Vector3( nbx, nby, nbz ),
			new THREE.Vector3( ndx, ndy, ndz )
		], null, mi ) );

		scope.faces.push( new THREE.Face3( b, c, d, [
			new THREE.Vector3( nbx, nby, nbz ),
			new THREE.Vector3( ncx, ncy, ncz ),
			new THREE.Vector3( ndx, ndy, ndz )
		], null, mi ) );

	};

	function uv3 ( where, u1, v1, u2, v2, u3, v3 ) {

		where.push( [
			new THREE.Vector2( u1, v1 ),
			new THREE.Vector2( u2, v2 ),
			new THREE.Vector2( u3, v3 )
		] );

	};

	function uv4 ( where, u1, v1, u2, v2, u3, v3, u4, v4 ) {

		where.push( [
			new THREE.Vector2( u1, v1 ),
			new THREE.Vector2( u2, v2 ),
			new THREE.Vector2( u4, v4 )
		] );

		where.push( [
			new THREE.Vector2( u2, v2 ),
			new THREE.Vector2( u3, v3 ),
			new THREE.Vector2( u4, v4 )
		] );

	};

	Model.prototype = Object.create( THREE.Geometry.prototype );

	var geometry = new Model( texturePath );
	var materials = this.initMaterials( jsonMaterials, texturePath );

	if ( this.needsTangents( materials ) ) geometry.computeTangents();

	callback( geometry, materials );

};
/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.2.2
 */

/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */


(function(_global) {
  "use strict";

  var shim = {};
  if (typeof(exports) === 'undefined') {
    if(typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
      shim.exports = {};
      define(function() {
        return shim.exports;
      });
    } else {
      // gl-matrix lives in a browser, define its namespaces in global
      shim.exports = typeof(window) !== 'undefined' ? window : _global;
    }
  }
  else {
    // gl-matrix lives in commonjs, define its namespaces in exports
    shim.exports = exports;
  }

  (function(exports) {
    /* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */


if(!GLMAT_EPSILON) {
    var GLMAT_EPSILON = 0.000001;
}

if(!GLMAT_ARRAY_TYPE) {
    var GLMAT_ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
}

if(!GLMAT_RANDOM) {
    var GLMAT_RANDOM = Math.random;
}

/**
 * @class Common utilities
 * @name glMatrix
 */
var glMatrix = {};

/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
glMatrix.setMatrixArrayType = function(type) {
    GLMAT_ARRAY_TYPE = type;
}

if(typeof(exports) !== 'undefined') {
    exports.glMatrix = glMatrix;
}

var degree = Math.PI / 180;

/**
* Convert Degree To Radian
*
* @param {Number} Angle in Degrees
*/
glMatrix.toRadian = function(a){
     return a * degree;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2 Dimensional Vector
 * @name vec2
 */

var vec2 = {};

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
vec2.create = function() {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = 0;
    out[1] = 0;
    return out;
};

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */
vec2.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
vec2.fromValues = function(x, y) {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
vec2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
vec2.set = function(out, x, y) {
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
};

/**
 * Alias for {@link vec2.subtract}
 * @function
 */
vec2.sub = vec2.subtract;

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
};

/**
 * Alias for {@link vec2.multiply}
 * @function
 */
vec2.mul = vec2.multiply;

/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
};

/**
 * Alias for {@link vec2.divide}
 * @function
 */
vec2.div = vec2.divide;

/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    return out;
};

/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    return out;
};

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
vec2.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
};

/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */
vec2.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
vec2.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.distance}
 * @function
 */
vec2.dist = vec2.distance;

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec2.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */
vec2.sqrDist = vec2.squaredDistance;

/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
vec2.length = function (a) {
    var x = a[0],
        y = a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.length}
 * @function
 */
vec2.len = vec2.length;

/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec2.squaredLength = function (a) {
    var x = a[0],
        y = a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */
vec2.sqrLen = vec2.squaredLength;

/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */
vec2.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
};

/**
 * Returns the inverse of the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to invert
 * @returns {vec2} out
 */
vec2.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  return out;
};

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
vec2.normalize = function(out, a) {
    var x = a[0],
        y = a[1];
    var len = x*x + y*y;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
vec2.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1];
};

/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */
vec2.cross = function(out, a, b) {
    var z = a[0] * b[1] - a[1] * b[0];
    out[0] = out[1] = 0;
    out[2] = z;
    return out;
};

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */
vec2.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */
vec2.random = function (out, scale) {
    scale = scale || 1.0;
    var r = GLMAT_RANDOM() * 2.0 * Math.PI;
    out[0] = Math.cos(r) * scale;
    out[1] = Math.sin(r) * scale;
    return out;
};

/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    return out;
};

/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2d = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
};

/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat3 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[3] * y + m[6];
    out[1] = m[1] * x + m[4] * y + m[7];
    return out;
};

/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat4 = function(out, a, m) {
    var x = a[0], 
        y = a[1];
    out[0] = m[0] * x + m[4] * y + m[12];
    out[1] = m[1] * x + m[5] * y + m[13];
    return out;
};

/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec2.forEach = (function() {
    var vec = vec2.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 2;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec2} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec2.str = function (a) {
    return 'vec2(' + a[0] + ', ' + a[1] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec2 = vec2;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 3 Dimensional Vector
 * @name vec3
 */

var vec3 = {};

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
vec3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
};

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
vec3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
vec3.fromValues = function(x, y, z) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
vec3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
vec3.set = function(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
};

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
vec3.sub = vec3.subtract;

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
};

/**
 * Alias for {@link vec3.multiply}
 * @function
 */
vec3.mul = vec3.multiply;

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
};

/**
 * Alias for {@link vec3.divide}
 * @function
 */
vec3.div = vec3.divide;

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
};

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
};

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
vec3.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
};

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
vec3.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
vec3.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.distance}
 * @function
 */
vec3.dist = vec3.distance;

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec3.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
vec3.sqrDist = vec3.squaredDistance;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
vec3.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.length}
 * @function
 */
vec3.len = vec3.length;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec3.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
vec3.sqrLen = vec3.squaredLength;

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
vec3.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
};

/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */
vec3.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
};

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
vec3.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x*x + y*y + z*z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
vec3.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.cross = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
};

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
vec3.random = function (out, scale) {
    scale = scale || 1.0;

    var r = GLMAT_RANDOM() * 2.0 * Math.PI;
    var z = (GLMAT_RANDOM() * 2.0) - 1.0;
    var zScale = Math.sqrt(1.0-z*z) * scale;

    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale;
    return out;
};

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2],
        w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1.0;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
};

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat3 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
};

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
vec3.transformQuat = function(out, a, q) {
    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateX = function(out, a, b, c){
   var p = [], r=[];
	  //Translate point to the origin
	  p[0] = a[0] - b[0];
	  p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];

	  //perform rotation
	  r[0] = p[0];
	  r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c);
	  r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c);

	  //translate to correct position
	  out[0] = r[0] + b[0];
	  out[1] = r[1] + b[1];
	  out[2] = r[2] + b[2];

  	return out;
};

/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateY = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c);
  	r[1] = p[1];
  	r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c);
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateZ = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c);
  	r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c);
  	r[2] = p[2];
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec3.forEach = (function() {
    var vec = vec3.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 3;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec3.str = function (a) {
    return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec3 = vec3;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4 Dimensional Vector
 * @name vec4
 */

var vec4 = {};

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
vec4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
};

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
vec4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
vec4.fromValues = function(x, y, z, w) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
vec4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
vec4.set = function(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
};

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
vec4.sub = vec4.subtract;

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];
    return out;
};

/**
 * Alias for {@link vec4.multiply}
 * @function
 */
vec4.mul = vec4.multiply;

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    out[3] = a[3] / b[3];
    return out;
};

/**
 * Alias for {@link vec4.divide}
 * @function
 */
vec4.div = vec4.divide;

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    out[3] = Math.min(a[3], b[3]);
    return out;
};

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    out[3] = Math.max(a[3], b[3]);
    return out;
};

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
vec4.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
};

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
vec4.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
vec4.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.distance}
 * @function
 */
vec4.dist = vec4.distance;

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec4.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
vec4.sqrDist = vec4.squaredDistance;

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
vec4.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.length}
 * @function
 */
vec4.len = vec4.length;

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec4.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
vec4.sqrLen = vec4.squaredLength;

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
vec4.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = -a[3];
    return out;
};

/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to invert
 * @returns {vec4} out
 */
vec4.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  out[3] = 1.0 / a[3];
  return out;
};

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
vec4.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    var len = x*x + y*y + z*z + w*w;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
        out[3] = a[3] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
vec4.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */
vec4.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */
vec4.random = function (out, scale) {
    scale = scale || 1.0;

    //TODO: This is a pretty awful way of doing this. Find something better.
    out[0] = GLMAT_RANDOM();
    out[1] = GLMAT_RANDOM();
    out[2] = GLMAT_RANDOM();
    out[3] = GLMAT_RANDOM();
    vec4.normalize(out, out);
    vec4.scale(out, out, scale);
    return out;
};

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
vec4.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
};

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
vec4.transformQuat = function(out, a, q) {
    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec4.forEach = (function() {
    var vec = vec4.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 4;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec4.str = function (a) {
    return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec4 = vec4;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2x2 Matrix
 * @name mat2
 */

var mat2 = {};

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */
mat2.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {mat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */
mat2.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */
mat2.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a1 = a[1];
        out[1] = a[2];
        out[2] = a1;
    } else {
        out[0] = a[0];
        out[1] = a[2];
        out[2] = a[1];
        out[3] = a[3];
    }
    
    return out;
};

/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],

        // Calculate the determinant
        det = a0 * a3 - a2 * a1;

    if (!det) {
        return null;
    }
    det = 1.0 / det;
    
    out[0] =  a3 * det;
    out[1] = -a1 * det;
    out[2] = -a2 * det;
    out[3] =  a0 * det;

    return out;
};

/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.adjoint = function(out, a) {
    // Caching this value is nessecary if out == a
    var a0 = a[0];
    out[0] =  a[3];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] =  a0;

    return out;
};

/**
 * Calculates the determinant of a mat2
 *
 * @param {mat2} a the source matrix
 * @returns {Number} determinant of a
 */
mat2.determinant = function (a) {
    return a[0] * a[3] - a[2] * a[1];
};

/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    return out;
};

/**
 * Alias for {@link mat2.multiply}
 * @function
 */
mat2.mul = mat2.multiply;

/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    return out;
};

/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/
mat2.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    return out;
};

/**
 * Returns a string representation of a mat2
 *
 * @param {mat2} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2.str = function (a) {
    return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

/**
 * Returns Frobenius norm of a mat2
 *
 * @param {mat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)))
};

/**
 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
 * @param {mat2} L the lower triangular matrix 
 * @param {mat2} D the diagonal matrix 
 * @param {mat2} U the upper triangular matrix 
 * @param {mat2} a the input matrix to factorize
 */

mat2.LDU = function (L, D, U, a) { 
    L[2] = a[2]/a[0]; 
    U[0] = a[0]; 
    U[1] = a[1]; 
    U[3] = a[3] - L[2] * U[1]; 
    return [L, D, U];       
}; 

if(typeof(exports) !== 'undefined') {
    exports.mat2 = mat2;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2x3 Matrix
 * @name mat2d
 * 
 * @description 
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */

var mat2d = {};

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.create = function() {
    var out = new GLMAT_ARRAY_TYPE(6);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {mat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(6);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */
mat2d.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.invert = function(out, a) {
    var aa = a[0], ab = a[1], ac = a[2], ad = a[3],
        atx = a[4], aty = a[5];

    var det = aa * ad - ab * ac;
    if(!det){
        return null;
    }
    det = 1.0 / det;

    out[0] = ad * det;
    out[1] = -ab * det;
    out[2] = -ac * det;
    out[3] = aa * det;
    out[4] = (ac * aty - ad * atx) * det;
    out[5] = (ab * atx - aa * aty) * det;
    return out;
};

/**
 * Calculates the determinant of a mat2d
 *
 * @param {mat2d} a the source matrix
 * @returns {Number} determinant of a
 */
mat2d.determinant = function (a) {
    return a[0] * a[3] - a[1] * a[2];
};

/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    out[4] = a0 * b4 + a2 * b5 + a4;
    out[5] = a1 * b4 + a3 * b5 + a5;
    return out;
};

/**
 * Alias for {@link mat2d.multiply}
 * @function
 */
mat2d.mul = mat2d.multiply;


/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
mat2d.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/
mat2d.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/
mat2d.translate = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0;
    out[1] = a1;
    out[2] = a2;
    out[3] = a3;
    out[4] = a0 * v0 + a2 * v1 + a4;
    out[5] = a1 * v0 + a3 * v1 + a5;
    return out;
};

/**
 * Returns a string representation of a mat2d
 *
 * @param {mat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2d.str = function (a) {
    return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ')';
};

/**
 * Returns Frobenius norm of a mat2d
 *
 * @param {mat2d} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2d.frob = function (a) { 
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1))
}; 

if(typeof(exports) !== 'undefined') {
    exports.mat2d = mat2d;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 3x3 Matrix
 * @name mat3
 */

var mat3 = {};

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
mat3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
mat3.fromMat4 = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
};

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
mat3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
mat3.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a12 = a[5];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a01;
        out[5] = a[7];
        out[6] = a02;
        out[7] = a12;
    } else {
        out[0] = a[0];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a[1];
        out[4] = a[4];
        out[5] = a[7];
        out[6] = a[2];
        out[7] = a[5];
        out[8] = a[8];
    }
    
    return out;
};

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,

        // Calculate the determinant
        det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
};

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    out[0] = (a11 * a22 - a12 * a21);
    out[1] = (a02 * a21 - a01 * a22);
    out[2] = (a01 * a12 - a02 * a11);
    out[3] = (a12 * a20 - a10 * a22);
    out[4] = (a00 * a22 - a02 * a20);
    out[5] = (a02 * a10 - a00 * a12);
    out[6] = (a10 * a21 - a11 * a20);
    out[7] = (a01 * a20 - a00 * a21);
    out[8] = (a00 * a11 - a01 * a10);
    return out;
};

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
mat3.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
};

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b00 = b[0], b01 = b[1], b02 = b[2],
        b10 = b[3], b11 = b[4], b12 = b[5],
        b20 = b[6], b21 = b[7], b22 = b[8];

    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;

    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;

    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
};

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
mat3.mul = mat3.multiply;

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
mat3.translate = function(out, a, v) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],
        x = v[0], y = v[1];

    out[0] = a00;
    out[1] = a01;
    out[2] = a02;

    out[3] = a10;
    out[4] = a11;
    out[5] = a12;

    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
};

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.rotate = function (out, a, rad) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        s = Math.sin(rad),
        c = Math.cos(rad);

    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;

    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;

    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
};

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
mat3.scale = function(out, a, v) {
    var x = v[0], y = v[1];

    out[0] = x * a[0];
    out[1] = x * a[1];
    out[2] = x * a[2];

    out[3] = y * a[3];
    out[4] = y * a[4];
    out[5] = y * a[5];

    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/
mat3.fromMat2d = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = 0;

    out[3] = a[2];
    out[4] = a[3];
    out[5] = 0;

    out[6] = a[4];
    out[7] = a[5];
    out[8] = 1;
    return out;
};

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
mat3.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[3] = yx - wz;
    out[6] = zx + wy;

    out[1] = yx + wz;
    out[4] = 1 - xx - zz;
    out[7] = zy - wx;

    out[2] = zx - wy;
    out[5] = zy + wx;
    out[8] = 1 - xx - yy;

    return out;
};

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
mat3.normalFromMat4 = function (out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

    return out;
};

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat3.str = function (a) {
    return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + 
                    a[6] + ', ' + a[7] + ', ' + a[8] + ')';
};

/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat3.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)))
};


if(typeof(exports) !== 'undefined') {
    exports.mat3 = mat3;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4x4 Matrix
 * @name mat4
 */

var mat4 = {};

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
mat4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
mat4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
mat4.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3],
            a12 = a[6], a13 = a[7],
            a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }
    
    return out;
};

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
};

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
mat4.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};

/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
mat4.mul = mat4.multiply;

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.translate = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};

/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.scale = function(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Rotates a mat4 by the given angle
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.rotate = function (out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < GLMAT_EPSILON) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateX = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[0]  = a[0];
        out[1]  = a[1];
        out[2]  = a[2];
        out[3]  = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateY = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateZ = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslation = function (out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    
    return out;
};

mat4.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;

    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;

    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
};

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.frustum = function (out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.ortho = function (out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
mat4.lookAt = function (out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < GLMAT_EPSILON &&
        Math.abs(eyey - centery) < GLMAT_EPSILON &&
        Math.abs(eyez - centerz) < GLMAT_EPSILON) {
        return mat4.identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat4.str = function (a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};

/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat4.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2) ))
};


if(typeof(exports) !== 'undefined') {
    exports.mat4 = mat4;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class Quaternion
 * @name quat
 */

var quat = {};

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
quat.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
quat.rotationTo = (function() {
    var tmpvec3 = vec3.create();
    var xUnitVec3 = vec3.fromValues(1,0,0);
    var yUnitVec3 = vec3.fromValues(0,1,0);

    return function(out, a, b) {
        var dot = vec3.dot(a, b);
        if (dot < -0.999999) {
            vec3.cross(tmpvec3, xUnitVec3, a);
            if (vec3.length(tmpvec3) < 0.000001)
                vec3.cross(tmpvec3, yUnitVec3, a);
            vec3.normalize(tmpvec3, tmpvec3);
            quat.setAxisAngle(out, tmpvec3, Math.PI);
            return out;
        } else if (dot > 0.999999) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        } else {
            vec3.cross(tmpvec3, a, b);
            out[0] = tmpvec3[0];
            out[1] = tmpvec3[1];
            out[2] = tmpvec3[2];
            out[3] = 1 + dot;
            return quat.normalize(out, out);
        }
    };
})();

/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
quat.setAxes = (function() {
    var matr = mat3.create();

    return function(out, view, right, up) {
        matr[0] = right[0];
        matr[3] = right[1];
        matr[6] = right[2];

        matr[1] = up[0];
        matr[4] = up[1];
        matr[7] = up[2];

        matr[2] = -view[0];
        matr[5] = -view[1];
        matr[8] = -view[2];

        return quat.normalize(out, quat.fromMat3(out, matr));
    };
})();

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
quat.clone = vec4.clone;

/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
quat.fromValues = vec4.fromValues;

/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
quat.copy = vec4.copy;

/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
quat.set = vec4.set;

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
quat.identity = function(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
quat.setAxisAngle = function(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
};

/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */
quat.add = vec4.add;

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
quat.multiply = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
};

/**
 * Alias for {@link quat.multiply}
 * @function
 */
quat.mul = quat.multiply;

/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
quat.scale = vec4.scale;

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateX = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateY = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        by = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateZ = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bz = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
};

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
quat.calculateW = function (out, a) {
    var x = a[0], y = a[1], z = a[2];

    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return out;
};

/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
quat.dot = vec4.dot;

/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */
quat.lerp = vec4.lerp;

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
quat.slerp = function (out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    var        omega, cosom, sinom, scale0, scale1;

    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if ( cosom < 0.0 ) {
        cosom = -cosom;
        bx = - bx;
        by = - by;
        bz = - bz;
        bw = - bw;
    }
    // calculate coefficients
    if ( (1.0 - cosom) > 0.000001 ) {
        // standard case (slerp)
        omega  = Math.acos(cosom);
        sinom  = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
    } else {        
        // "from" and "to" quaternions are very close 
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - t;
        scale1 = t;
    }
    // calculate final values
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    
    return out;
};

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
quat.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        dot = a0*a0 + a1*a1 + a2*a2 + a3*a3,
        invDot = dot ? 1.0/dot : 0;
    
    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

    out[0] = -a0*invDot;
    out[1] = -a1*invDot;
    out[2] = -a2*invDot;
    out[3] = a3*invDot;
    return out;
};

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
quat.conjugate = function (out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
};

/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 * @function
 */
quat.length = vec4.length;

/**
 * Alias for {@link quat.length}
 * @function
 */
quat.len = quat.length;

/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
quat.squaredLength = vec4.squaredLength;

/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
quat.sqrLen = quat.squaredLength;

/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
quat.normalize = vec4.normalize;

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
quat.fromMat3 = function(out, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;

    if ( fTrace > 0.0 ) {
        // |w| > 1/2, may as well choose w > 1/2
        fRoot = Math.sqrt(fTrace + 1.0);  // 2w
        out[3] = 0.5 * fRoot;
        fRoot = 0.5/fRoot;  // 1/(4w)
        out[0] = (m[5]-m[7])*fRoot;
        out[1] = (m[6]-m[2])*fRoot;
        out[2] = (m[1]-m[3])*fRoot;
    } else {
        // |w| <= 1/2
        var i = 0;
        if ( m[4] > m[0] )
          i = 1;
        if ( m[8] > m[i*3+i] )
          i = 2;
        var j = (i+1)%3;
        var k = (i+2)%3;
        
        fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
        out[i] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot;
        out[3] = (m[j*3+k] - m[k*3+j]) * fRoot;
        out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
        out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
    }
    
    return out;
};

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
quat.str = function (a) {
    return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.quat = quat;
}
;













  })(shim.exports);
})(this);
if(typeof Math.imul == "undefined" || (Math.imul(0xffffffff,5) == 0)) {
    Math.imul = function (a, b) {
        var ah  = (a >>> 16) & 0xffff;
        var al = a & 0xffff;
        var bh  = (b >>> 16) & 0xffff;
        var bl = b & 0xffff;
        // the shift by 0 fixes the sign on the high part
        // the final |0 converts the unsigned value into a signed value
        return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
    }
}


;(function(){
var l,aa=this;
function t(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==
b&&"undefined"==typeof a.call)return"object";return b}var ba="closure_uid_"+(1E9*Math.random()>>>0),da=0;function ha(a,b,c){return a.call.apply(a.bind,arguments)}function ia(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}
function ka(a,b,c){ka=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ha:ia;return ka.apply(null,arguments)};function ma(a){return Array.prototype.join.call(arguments,"")}Math.random();function na(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function oa(a,b){null!=a&&this.append.apply(this,arguments)}l=oa.prototype;l.Pa="";l.set=function(a){this.Pa=""+a};l.append=function(a,b,c){this.Pa+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.Pa+=arguments[d];return this};l.clear=function(){this.Pa=""};l.toString=function(){return this.Pa};var qa=Array.prototype;function ra(a,b,c){return 2>=arguments.length?qa.slice.call(a,b):qa.slice.call(a,b,c)}function sa(a,b){return a>b?1:a<b?-1:0};if("undefined"===typeof ua)var ua=function(){throw Error("No *print-fn* fn set for evaluation environment");};var va=!0,wa=null;if("undefined"===typeof Ba)var Ba=null;function Ca(){return new v(null,5,[Da,!0,Ea,!0,Ga,!1,Ha,!1,Ia,null],null)}function w(a){return null!=a&&!1!==a}function Ja(a){return w(a)?!1:!0}function y(a,b){return a[t(null==b?null:b)]?!0:a._?!0:!1}function Ka(a){return null==a?null:a.constructor}
function z(a,b){var c=Ka(b),c=w(w(c)?c.Za:c)?c.Ya:t(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function La(a){var b=a.Ya;return w(b)?b:""+B(a)}var Ma="undefined"!==typeof Symbol&&"function"===t(Symbol)?Symbol.zd:"@@iterator";function Na(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}function Oa(a){for(var b=Array(arguments.length),c=0;;)if(c<b.length)b[c]=arguments[c],c+=1;else return b}
var Qa=function(){function a(a,b){function c(a,b){a.push(b);return a}var g=[];return Pa.c?Pa.c(c,g,b):Pa.call(null,c,g,b)}function b(a){return c.b(null,a)}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,0,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}(),Ra={},Sa={};function Ta(a){if(a?a.O:a)return a.O(a);var b;b=Ta[t(null==a?null:a)];if(!b&&(b=Ta._,!b))throw z("ICounted.-count",a);return b.call(null,a)}
function Ua(a){if(a?a.U:a)return a.U(a);var b;b=Ua[t(null==a?null:a)];if(!b&&(b=Ua._,!b))throw z("IEmptyableCollection.-empty",a);return b.call(null,a)}var Va={};function Wa(a,b){if(a?a.N:a)return a.N(a,b);var c;c=Wa[t(null==a?null:a)];if(!c&&(c=Wa._,!c))throw z("ICollection.-conj",a);return c.call(null,a,b)}
var Za={},C=function(){function a(a,b,c){if(a?a.ta:a)return a.ta(a,b,c);var g;g=C[t(null==a?null:a)];if(!g&&(g=C._,!g))throw z("IIndexed.-nth",a);return g.call(null,a,b,c)}function b(a,b){if(a?a.v:a)return a.v(a,b);var c;c=C[t(null==a?null:a)];if(!c&&(c=C._,!c))throw z("IIndexed.-nth",a);return c.call(null,a,b)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}(),
$a={};function ab(a){if(a?a.ga:a)return a.ga(a);var b;b=ab[t(null==a?null:a)];if(!b&&(b=ab._,!b))throw z("ISeq.-first",a);return b.call(null,a)}function bb(a){if(a?a.sa:a)return a.sa(a);var b;b=bb[t(null==a?null:a)];if(!b&&(b=bb._,!b))throw z("ISeq.-rest",a);return b.call(null,a)}
var cb={},eb={},fb=function(){function a(a,b,c){if(a?a.I:a)return a.I(a,b,c);var g;g=fb[t(null==a?null:a)];if(!g&&(g=fb._,!g))throw z("ILookup.-lookup",a);return g.call(null,a,b,c)}function b(a,b){if(a?a.J:a)return a.J(a,b);var c;c=fb[t(null==a?null:a)];if(!c&&(c=fb._,!c))throw z("ILookup.-lookup",a);return c.call(null,a,b)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=
a;return c}();function gb(a,b){if(a?a.Fb:a)return a.Fb(a,b);var c;c=gb[t(null==a?null:a)];if(!c&&(c=gb._,!c))throw z("IAssociative.-contains-key?",a);return c.call(null,a,b)}function hb(a,b,c){if(a?a.Ea:a)return a.Ea(a,b,c);var d;d=hb[t(null==a?null:a)];if(!d&&(d=hb._,!d))throw z("IAssociative.-assoc",a);return d.call(null,a,b,c)}var ib={};function jb(a,b){if(a?a.La:a)return a.La(a,b);var c;c=jb[t(null==a?null:a)];if(!c&&(c=jb._,!c))throw z("IMap.-dissoc",a);return c.call(null,a,b)}var kb={};
function lb(a){if(a?a.Kb:a)return a.Kb();var b;b=lb[t(null==a?null:a)];if(!b&&(b=lb._,!b))throw z("IMapEntry.-key",a);return b.call(null,a)}function mb(a){if(a?a.Lb:a)return a.Lb();var b;b=mb[t(null==a?null:a)];if(!b&&(b=mb._,!b))throw z("IMapEntry.-val",a);return b.call(null,a)}var nb={};function ob(a,b){if(a?a.Ub:a)return a.Ub(0,b);var c;c=ob[t(null==a?null:a)];if(!c&&(c=ob._,!c))throw z("ISet.-disjoin",a);return c.call(null,a,b)}var pb={};
function qb(a,b,c){if(a?a.Mb:a)return a.Mb(a,b,c);var d;d=qb[t(null==a?null:a)];if(!d&&(d=qb._,!d))throw z("IVector.-assoc-n",a);return d.call(null,a,b,c)}function rb(a){if(a?a.Wa:a)return a.Wa(a);var b;b=rb[t(null==a?null:a)];if(!b&&(b=rb._,!b))throw z("IDeref.-deref",a);return b.call(null,a)}var sb={};function ub(a){if(a?a.A:a)return a.A(a);var b;b=ub[t(null==a?null:a)];if(!b&&(b=ub._,!b))throw z("IMeta.-meta",a);return b.call(null,a)}var vb={};
function wb(a,b){if(a?a.F:a)return a.F(a,b);var c;c=wb[t(null==a?null:a)];if(!c&&(c=wb._,!c))throw z("IWithMeta.-with-meta",a);return c.call(null,a,b)}
var xb={},yb=function(){function a(a,b,c){if(a?a.ka:a)return a.ka(a,b,c);var g;g=yb[t(null==a?null:a)];if(!g&&(g=yb._,!g))throw z("IReduce.-reduce",a);return g.call(null,a,b,c)}function b(a,b){if(a?a.ja:a)return a.ja(a,b);var c;c=yb[t(null==a?null:a)];if(!c&&(c=yb._,!c))throw z("IReduce.-reduce",a);return c.call(null,a,b)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=
a;return c}();function zb(a,b){if(a?a.C:a)return a.C(a,b);var c;c=zb[t(null==a?null:a)];if(!c&&(c=zb._,!c))throw z("IEquiv.-equiv",a);return c.call(null,a,b)}function Bb(a){if(a?a.D:a)return a.D(a);var b;b=Bb[t(null==a?null:a)];if(!b&&(b=Bb._,!b))throw z("IHash.-hash",a);return b.call(null,a)}var Cb={};function Db(a){if(a?a.M:a)return a.M(a);var b;b=Db[t(null==a?null:a)];if(!b&&(b=Db._,!b))throw z("ISeqable.-seq",a);return b.call(null,a)}var Eb={};
function Fb(a,b){if(a?a.Zb:a)return a.Zb(0,b);var c;c=Fb[t(null==a?null:a)];if(!c&&(c=Fb._,!c))throw z("IWriter.-write",a);return c.call(null,a,b)}var Gb={};function Hb(a,b,c){if(a?a.w:a)return a.w(a,b,c);var d;d=Hb[t(null==a?null:a)];if(!d&&(d=Hb._,!d))throw z("IPrintWithWriter.-pr-writer",a);return d.call(null,a,b,c)}function Ib(a,b,c){if(a?a.Xb:a)return a.Xb(0,b,c);var d;d=Ib[t(null==a?null:a)];if(!d&&(d=Ib._,!d))throw z("IWatchable.-notify-watches",a);return d.call(null,a,b,c)}
function Jb(a,b,c){if(a?a.Wb:a)return a.Wb(0,b,c);var d;d=Jb[t(null==a?null:a)];if(!d&&(d=Jb._,!d))throw z("IWatchable.-add-watch",a);return d.call(null,a,b,c)}function Kb(a,b){if(a?a.Yb:a)return a.Yb(0,b);var c;c=Kb[t(null==a?null:a)];if(!c&&(c=Kb._,!c))throw z("IWatchable.-remove-watch",a);return c.call(null,a,b)}function Lb(a){if(a?a.Xa:a)return a.Xa(a);var b;b=Lb[t(null==a?null:a)];if(!b&&(b=Lb._,!b))throw z("IEditableCollection.-as-transient",a);return b.call(null,a)}
function Mb(a,b){if(a?a.Qa:a)return a.Qa(a,b);var c;c=Mb[t(null==a?null:a)];if(!c&&(c=Mb._,!c))throw z("ITransientCollection.-conj!",a);return c.call(null,a,b)}function Nb(a){if(a?a.Ra:a)return a.Ra(a);var b;b=Nb[t(null==a?null:a)];if(!b&&(b=Nb._,!b))throw z("ITransientCollection.-persistent!",a);return b.call(null,a)}function Ob(a,b,c){if(a?a.kb:a)return a.kb(a,b,c);var d;d=Ob[t(null==a?null:a)];if(!d&&(d=Ob._,!d))throw z("ITransientAssociative.-assoc!",a);return d.call(null,a,b,c)}
function Pb(a,b,c){if(a?a.Vb:a)return a.Vb(0,b,c);var d;d=Pb[t(null==a?null:a)];if(!d&&(d=Pb._,!d))throw z("ITransientVector.-assoc-n!",a);return d.call(null,a,b,c)}function Qb(a){if(a?a.Rb:a)return a.Rb();var b;b=Qb[t(null==a?null:a)];if(!b&&(b=Qb._,!b))throw z("IChunk.-drop-first",a);return b.call(null,a)}function Rb(a){if(a?a.Hb:a)return a.Hb(a);var b;b=Rb[t(null==a?null:a)];if(!b&&(b=Rb._,!b))throw z("IChunkedSeq.-chunked-first",a);return b.call(null,a)}
function Sb(a){if(a?a.Ib:a)return a.Ib(a);var b;b=Sb[t(null==a?null:a)];if(!b&&(b=Sb._,!b))throw z("IChunkedSeq.-chunked-rest",a);return b.call(null,a)}function Tb(a){if(a?a.Gb:a)return a.Gb(a);var b;b=Tb[t(null==a?null:a)];if(!b&&(b=Tb._,!b))throw z("IChunkedNext.-chunked-next",a);return b.call(null,a)}function Ub(a){if(a?a.hb:a)return a.hb(a);var b;b=Ub[t(null==a?null:a)];if(!b&&(b=Ub._,!b))throw z("INamed.-name",a);return b.call(null,a)}
function Vb(a){if(a?a.ib:a)return a.ib(a);var b;b=Vb[t(null==a?null:a)];if(!b&&(b=Vb._,!b))throw z("INamed.-namespace",a);return b.call(null,a)}function Wb(a,b){if(a?a.Wc:a)return a.Wc(a,b);var c;c=Wb[t(null==a?null:a)];if(!c&&(c=Wb._,!c))throw z("IReset.-reset!",a);return c.call(null,a,b)}
var Xb=function(){function a(a,b,c,d,e){if(a?a.$c:a)return a.$c(a,b,c,d,e);var n;n=Xb[t(null==a?null:a)];if(!n&&(n=Xb._,!n))throw z("ISwap.-swap!",a);return n.call(null,a,b,c,d,e)}function b(a,b,c,d){if(a?a.Zc:a)return a.Zc(a,b,c,d);var e;e=Xb[t(null==a?null:a)];if(!e&&(e=Xb._,!e))throw z("ISwap.-swap!",a);return e.call(null,a,b,c,d)}function c(a,b,c){if(a?a.Yc:a)return a.Yc(a,b,c);var d;d=Xb[t(null==a?null:a)];if(!d&&(d=Xb._,!d))throw z("ISwap.-swap!",a);return d.call(null,a,b,c)}function d(a,b){if(a?
a.Xc:a)return a.Xc(a,b);var c;c=Xb[t(null==a?null:a)];if(!c&&(c=Xb._,!c))throw z("ISwap.-swap!",a);return c.call(null,a,b)}var e=null,e=function(e,g,h,k,m){switch(arguments.length){case 2:return d.call(this,e,g);case 3:return c.call(this,e,g,h);case 4:return b.call(this,e,g,h,k);case 5:return a.call(this,e,g,h,k,m)}throw Error("Invalid arity: "+arguments.length);};e.b=d;e.c=c;e.i=b;e.s=a;return e}();
function Yb(a){if(a?a.gb:a)return a.gb(a);var b;b=Yb[t(null==a?null:a)];if(!b&&(b=Yb._,!b))throw z("IIterable.-iterator",a);return b.call(null,a)}function Zb(a){this.od=a;this.q=0;this.j=1073741824}Zb.prototype.Zb=function(a,b){return this.od.append(b)};function $b(a){var b=new oa;a.w(null,new Zb(b),Ca());return""+B(b)}
var ac="undefined"!==typeof Math.imul&&0!==(Math.imul.b?Math.imul.b(4294967295,5):Math.imul.call(null,4294967295,5))?function(a,b){return Math.imul.b?Math.imul.b(a,b):Math.imul.call(null,a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function bc(a){a=ac(a,3432918353);return ac(a<<15|a>>>-15,461845907)}function cc(a,b){var c=a^b;return ac(c<<13|c>>>-13,5)+3864292196}
function dc(a,b){var c=a^b,c=ac(c^c>>>16,2246822507),c=ac(c^c>>>13,3266489909);return c^c>>>16}var ec={},fc=0;function hc(a){255<fc&&(ec={},fc=0);var b=ec[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b){for(var c=0,d=0;;)if(c<b)var e=c+1,d=ac(31,d)+a.charCodeAt(c),c=e;else{b=d;break a}b=void 0}else b=0;else b=0;ec[a]=b;fc+=1}return a=b}
function ic(a){a&&(a.j&4194304||a.td)?a=a.D(null):"number"===typeof a?a=(Math.floor.a?Math.floor.a(a):Math.floor.call(null,a))%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=hc(a),0!==a&&(a=bc(a),a=cc(0,a),a=dc(a,4))):a=a instanceof Date?a.valueOf():null==a?0:Bb(a);return a}
function jc(a){var b;b=a.name;var c;a:{c=1;for(var d=0;;)if(c<b.length){var e=c+2,d=cc(d,bc(b.charCodeAt(c-1)|b.charCodeAt(c)<<16));c=e}else{c=d;break a}c=void 0}c=1===(b.length&1)?c^bc(b.charCodeAt(b.length-1)):c;b=dc(c,ac(2,b.length));a=hc(a.na);return b^a+2654435769+(b<<6)+(b>>2)}function kc(a,b){if(a.str===b.str)return 0;var c=Ja(a.na);if(w(c?b.na:c))return-1;if(w(a.na)){if(Ja(b.na))return 1;c=sa(a.na,b.na);return 0===c?sa(a.name,b.name):c}return sa(a.name,b.name)}
function lc(a,b,c,d,e){this.na=a;this.name=b;this.str=c;this.Va=d;this.oa=e;this.j=2154168321;this.q=4096}l=lc.prototype;l.w=function(a,b){return Fb(b,this.str)};l.hb=function(){return this.name};l.ib=function(){return this.na};l.D=function(){var a=this.Va;return null!=a?a:this.Va=a=jc(this)};l.F=function(a,b){return new lc(this.na,this.name,this.str,this.Va,b)};l.A=function(){return this.oa};
l.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return fb.c(c,this,null);case 3:return fb.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return fb.c(c,this,null)};a.c=function(a,c,d){return fb.c(c,this,d)};return a}();l.apply=function(a,b){return this.call.apply(this,[this].concat(Na(b)))};l.a=function(a){return fb.c(a,this,null)};l.b=function(a,b){return fb.c(a,this,b)};l.C=function(a,b){return b instanceof lc?this.str===b.str:!1};
l.toString=function(){return this.str};var mc=function(){function a(a,b){var c=null!=a?[B(a),B("/"),B(b)].join(""):b;return new lc(a,b,c,null,null)}function b(a){return a instanceof lc?a:c.b(null,a)}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}();
function E(a){if(null==a)return null;if(a&&(a.j&8388608||a.ud))return a.M(null);if(a instanceof Array||"string"===typeof a)return 0===a.length?null:new F(a,0);if(y(Cb,a))return Db(a);throw Error([B(a),B(" is not ISeqable")].join(""));}function H(a){if(null==a)return null;if(a&&(a.j&64||a.jb))return a.ga(null);a=E(a);return null==a?null:ab(a)}function I(a){return null!=a?a&&(a.j&64||a.jb)?a.sa(null):(a=E(a))?bb(a):nc:nc}function J(a){return null==a?null:a&&(a.j&128||a.ub)?a.la(null):E(I(a))}
var oc=function(){function a(a,b){return null==a?null==b:a===b||zb(a,b)}var b=null,c=function(){function a(b,d,h){var k=null;if(2<arguments.length){for(var k=0,m=Array(arguments.length-2);k<m.length;)m[k]=arguments[k+2],++k;k=new F(m,0)}return c.call(this,b,d,k)}function c(a,d,e){for(;;)if(b.b(a,d))if(J(e))a=d,d=H(e),e=J(e);else return b.b(d,H(e));else return!1}a.l=2;a.h=function(a){var b=H(a);a=J(a);var d=H(a);a=I(a);return c(b,d,a)};a.d=c;return a}(),b=function(b,e,f){switch(arguments.length){case 1:return!0;
case 2:return a.call(this,b,e);default:var g=null;if(2<arguments.length){for(var g=0,h=Array(arguments.length-2);g<h.length;)h[g]=arguments[g+2],++g;g=new F(h,0)}return c.d(b,e,g)}throw Error("Invalid arity: "+arguments.length);};b.l=2;b.h=c.h;b.a=function(){return!0};b.b=a;b.d=c.d;return b}();function pc(a){this.K=a}pc.prototype.next=function(){if(null!=this.K){var a=H(this.K);this.K=J(this.K);return{done:!1,value:a}}return{done:!0,value:null}};function qc(a){return new pc(E(a))}
function rc(a,b){var c=bc(a),c=cc(0,c);return dc(c,b)}function sc(a){var b=0,c=1;for(a=E(a);;)if(null!=a)b+=1,c=ac(31,c)+ic(H(a))|0,a=J(a);else return rc(c,b)}var tc=rc(1,0);function uc(a){var b=0,c=0;for(a=E(a);;)if(null!=a)b+=1,c=c+ic(H(a))|0,a=J(a);else return rc(c,b)}var vc=rc(0,0);Sa["null"]=!0;Ta["null"]=function(){return 0};Date.prototype.C=function(a,b){return b instanceof Date&&this.toString()===b.toString()};zb.number=function(a,b){return a===b};sb["function"]=!0;ub["function"]=function(){return null};
Ra["function"]=!0;Bb._=function(a){return a[ba]||(a[ba]=++da)};function wc(a){this.T=a;this.q=0;this.j=32768}wc.prototype.Wa=function(){return this.T};function xc(a){return a instanceof wc}function K(a){return rb(a)}
var yc=function(){function a(a,b,c,d){for(var k=Ta(a);;)if(d<k){var m=C.b(a,d);c=b.b?b.b(c,m):b.call(null,c,m);if(xc(c))return rb(c);d+=1}else return c}function b(a,b,c){var d=Ta(a),k=c;for(c=0;;)if(c<d){var m=C.b(a,c),k=b.b?b.b(k,m):b.call(null,k,m);if(xc(k))return rb(k);c+=1}else return k}function c(a,b){var c=Ta(a);if(0===c)return b.m?b.m():b.call(null);for(var d=C.b(a,0),k=1;;)if(k<c){var m=C.b(a,k),d=b.b?b.b(d,m):b.call(null,d,m);if(xc(d))return rb(d);k+=1}else return d}var d=null,d=function(d,
f,g,h){switch(arguments.length){case 2:return c.call(this,d,f);case 3:return b.call(this,d,f,g);case 4:return a.call(this,d,f,g,h)}throw Error("Invalid arity: "+arguments.length);};d.b=c;d.c=b;d.i=a;return d}(),zc=function(){function a(a,b,c,d){for(var k=a.length;;)if(d<k){var m=a[d];c=b.b?b.b(c,m):b.call(null,c,m);if(xc(c))return rb(c);d+=1}else return c}function b(a,b,c){var d=a.length,k=c;for(c=0;;)if(c<d){var m=a[c],k=b.b?b.b(k,m):b.call(null,k,m);if(xc(k))return rb(k);c+=1}else return k}function c(a,
b){var c=a.length;if(0===a.length)return b.m?b.m():b.call(null);for(var d=a[0],k=1;;)if(k<c){var m=a[k],d=b.b?b.b(d,m):b.call(null,d,m);if(xc(d))return rb(d);k+=1}else return d}var d=null,d=function(d,f,g,h){switch(arguments.length){case 2:return c.call(this,d,f);case 3:return b.call(this,d,f,g);case 4:return a.call(this,d,f,g,h)}throw Error("Invalid arity: "+arguments.length);};d.b=c;d.c=b;d.i=a;return d}();function Ac(a){return a?a.j&2||a.Mc?!0:a.j?!1:y(Sa,a):y(Sa,a)}
function Bc(a){return a?a.j&16||a.Sb?!0:a.j?!1:y(Za,a):y(Za,a)}function Cc(a,b){this.e=a;this.p=b}Cc.prototype.Ab=function(){return this.p<this.e.length};Cc.prototype.next=function(){var a=this.e[this.p];this.p+=1;return a};function F(a,b){this.e=a;this.p=b;this.j=166199550;this.q=8192}l=F.prototype;l.toString=function(){return $b(this)};l.v=function(a,b){var c=b+this.p;return c<this.e.length?this.e[c]:null};l.ta=function(a,b,c){a=b+this.p;return a<this.e.length?this.e[a]:c};
l.gb=function(){return new Cc(this.e,this.p)};l.la=function(){return this.p+1<this.e.length?new F(this.e,this.p+1):null};l.O=function(){return this.e.length-this.p};l.D=function(){return sc(this)};l.C=function(a,b){return Dc.b?Dc.b(this,b):Dc.call(null,this,b)};l.U=function(){return nc};l.ja=function(a,b){return zc.i(this.e,b,this.e[this.p],this.p+1)};l.ka=function(a,b,c){return zc.i(this.e,b,c,this.p)};l.ga=function(){return this.e[this.p]};
l.sa=function(){return this.p+1<this.e.length?new F(this.e,this.p+1):nc};l.M=function(){return this};l.N=function(a,b){return L.b?L.b(b,this):L.call(null,b,this)};F.prototype[Ma]=function(){return qc(this)};
var Ec=function(){function a(a,b){return b<a.length?new F(a,b):null}function b(a){return c.b(a,0)}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}(),N=function(){function a(a,b){return Ec.b(a,b)}function b(a){return Ec.b(a,0)}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+
arguments.length);};c.a=b;c.b=a;return c}();zb._=function(a,b){return a===b};
var Gc=function(){function a(a,b){return null!=a?Wa(a,b):Wa(nc,b)}var b=null,c=function(){function a(b,d,h){var k=null;if(2<arguments.length){for(var k=0,m=Array(arguments.length-2);k<m.length;)m[k]=arguments[k+2],++k;k=new F(m,0)}return c.call(this,b,d,k)}function c(a,d,e){for(;;)if(w(e))a=b.b(a,d),d=H(e),e=J(e);else return b.b(a,d)}a.l=2;a.h=function(a){var b=H(a);a=J(a);var d=H(a);a=I(a);return c(b,d,a)};a.d=c;return a}(),b=function(b,e,f){switch(arguments.length){case 0:return Fc;case 1:return b;
case 2:return a.call(this,b,e);default:var g=null;if(2<arguments.length){for(var g=0,h=Array(arguments.length-2);g<h.length;)h[g]=arguments[g+2],++g;g=new F(h,0)}return c.d(b,e,g)}throw Error("Invalid arity: "+arguments.length);};b.l=2;b.h=c.h;b.m=function(){return Fc};b.a=function(a){return a};b.b=a;b.d=c.d;return b}();
function O(a){if(null!=a)if(a&&(a.j&2||a.Mc))a=a.O(null);else if(a instanceof Array)a=a.length;else if("string"===typeof a)a=a.length;else if(y(Sa,a))a=Ta(a);else a:{a=E(a);for(var b=0;;){if(Ac(a)){a=b+Ta(a);break a}a=J(a);b+=1}a=void 0}else a=0;return a}
var Hc=function(){function a(a,b,c){for(;;){if(null==a)return c;if(0===b)return E(a)?H(a):c;if(Bc(a))return C.c(a,b,c);if(E(a))a=J(a),b-=1;else return c}}function b(a,b){for(;;){if(null==a)throw Error("Index out of bounds");if(0===b){if(E(a))return H(a);throw Error("Index out of bounds");}if(Bc(a))return C.b(a,b);if(E(a)){var c=J(a),g=b-1;a=c;b=g}else throw Error("Index out of bounds");}}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,
c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}(),Q=function(){function a(a,b,c){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return c;if(a&&(a.j&16||a.Sb))return a.ta(null,b,c);if(a instanceof Array||"string"===typeof a)return b<a.length?a[b]:c;if(y(Za,a))return C.b(a,b);if(a?a.j&64||a.jb||(a.j?0:y($a,a)):y($a,a))return Hc.c(a,b,c);throw Error([B("nth not supported on this type "),B(La(Ka(a)))].join(""));}function b(a,b){if("number"!==
typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(a&&(a.j&16||a.Sb))return a.v(null,b);if(a instanceof Array||"string"===typeof a)return b<a.length?a[b]:null;if(y(Za,a))return C.b(a,b);if(a?a.j&64||a.jb||(a.j?0:y($a,a)):y($a,a))return Hc.b(a,b);throw Error([B("nth not supported on this type "),B(La(Ka(a)))].join(""));}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+
arguments.length);};c.b=b;c.c=a;return c}(),R=function(){function a(a,b,c){return null!=a?a&&(a.j&256||a.Tb)?a.I(null,b,c):a instanceof Array?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:y(eb,a)?fb.c(a,b,c):c:c}function b(a,b){return null==a?null:a&&(a.j&256||a.Tb)?a.J(null,b):a instanceof Array?b<a.length?a[b]:null:"string"===typeof a?b<a.length?a[b]:null:y(eb,a)?fb.b(a,b):null}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,
c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}(),Jc=function(){function a(a,b,c){return null!=a?hb(a,b,c):Ic([b],[c])}var b=null,c=function(){function a(b,d,h,k){var m=null;if(3<arguments.length){for(var m=0,n=Array(arguments.length-3);m<n.length;)n[m]=arguments[m+3],++m;m=new F(n,0)}return c.call(this,b,d,h,m)}function c(a,d,e,k){for(;;)if(a=b.c(a,d,e),w(k))d=H(k),e=H(J(k)),k=J(J(k));else return a}a.l=3;a.h=function(a){var b=H(a);a=J(a);var d=H(a);a=J(a);var k=H(a);
a=I(a);return c(b,d,k,a)};a.d=c;return a}(),b=function(b,e,f,g){switch(arguments.length){case 3:return a.call(this,b,e,f);default:var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+3],++h;h=new F(k,0)}return c.d(b,e,f,h)}throw Error("Invalid arity: "+arguments.length);};b.l=3;b.h=c.h;b.c=a;b.d=c.d;return b}(),Kc=function(){function a(a,b){return null==a?null:jb(a,b)}var b=null,c=function(){function a(b,d,h){var k=null;if(2<arguments.length){for(var k=
0,m=Array(arguments.length-2);k<m.length;)m[k]=arguments[k+2],++k;k=new F(m,0)}return c.call(this,b,d,k)}function c(a,d,e){for(;;){if(null==a)return null;a=b.b(a,d);if(w(e))d=H(e),e=J(e);else return a}}a.l=2;a.h=function(a){var b=H(a);a=J(a);var d=H(a);a=I(a);return c(b,d,a)};a.d=c;return a}(),b=function(b,e,f){switch(arguments.length){case 1:return b;case 2:return a.call(this,b,e);default:var g=null;if(2<arguments.length){for(var g=0,h=Array(arguments.length-2);g<h.length;)h[g]=arguments[g+2],++g;
g=new F(h,0)}return c.d(b,e,g)}throw Error("Invalid arity: "+arguments.length);};b.l=2;b.h=c.h;b.a=function(a){return a};b.b=a;b.d=c.d;return b}();function Lc(a){var b="function"==t(a);return w(b)?b:a?w(w(null)?null:a.Lc)?!0:a.Ob?!1:y(Ra,a):y(Ra,a)}function Mc(a,b){this.f=a;this.o=b;this.q=0;this.j=393217}l=Mc.prototype;
l.call=function(){function a(a,b,c,d,e,f,g,h,k,m,n,p,r,q,u,s,x,A,G,M,D,P){a=this.f;return S.fb?S.fb(a,b,c,d,e,f,g,h,k,m,n,p,r,q,u,s,x,A,G,M,D,P):S.call(null,a,b,c,d,e,f,g,h,k,m,n,p,r,q,u,s,x,A,G,M,D,P)}function b(a,b,c,d,e,f,g,h,k,m,n,p,r,q,u,s,x,A,G,M,D){a=this;return a.f.ea?a.f.ea(b,c,d,e,f,g,h,k,m,n,p,r,q,u,s,x,A,G,M,D):a.f.call(null,b,c,d,e,f,g,h,k,m,n,p,r,q,u,s,x,A,G,M,D)}function c(a,b,c,d,e,f,g,h,k,m,n,p,r,q,u,s,x,A,G,M){a=this;return a.f.da?a.f.da(b,c,d,e,f,g,h,k,m,n,p,r,q,u,s,x,A,G,M):a.f.call(null,
b,c,d,e,f,g,h,k,m,n,p,r,q,u,s,x,A,G,M)}function d(a,b,c,d,e,f,g,h,k,m,n,p,r,q,u,s,x,A,G){a=this;return a.f.ca?a.f.ca(b,c,d,e,f,g,h,k,m,n,p,r,q,u,s,x,A,G):a.f.call(null,b,c,d,e,f,g,h,k,m,n,p,r,q,u,s,x,A,G)}function e(a,b,c,d,e,f,g,h,k,m,n,p,r,q,u,s,x,A){a=this;return a.f.ba?a.f.ba(b,c,d,e,f,g,h,k,m,n,p,r,q,u,s,x,A):a.f.call(null,b,c,d,e,f,g,h,k,m,n,p,r,q,u,s,x,A)}function f(a,b,c,d,e,f,g,h,k,m,n,p,r,q,u,s,x){a=this;return a.f.aa?a.f.aa(b,c,d,e,f,g,h,k,m,n,p,r,q,u,s,x):a.f.call(null,b,c,d,e,f,g,h,k,
m,n,p,r,q,u,s,x)}function g(a,b,c,d,e,f,g,h,k,m,n,p,r,q,u,s){a=this;return a.f.$?a.f.$(b,c,d,e,f,g,h,k,m,n,p,r,q,u,s):a.f.call(null,b,c,d,e,f,g,h,k,m,n,p,r,q,u,s)}function h(a,b,c,d,e,f,g,h,k,m,n,p,r,q,u){a=this;return a.f.Z?a.f.Z(b,c,d,e,f,g,h,k,m,n,p,r,q,u):a.f.call(null,b,c,d,e,f,g,h,k,m,n,p,r,q,u)}function k(a,b,c,d,e,f,g,h,k,m,n,p,r,q){a=this;return a.f.Y?a.f.Y(b,c,d,e,f,g,h,k,m,n,p,r,q):a.f.call(null,b,c,d,e,f,g,h,k,m,n,p,r,q)}function m(a,b,c,d,e,f,g,h,k,m,n,p,r){a=this;return a.f.X?a.f.X(b,
c,d,e,f,g,h,k,m,n,p,r):a.f.call(null,b,c,d,e,f,g,h,k,m,n,p,r)}function n(a,b,c,d,e,f,g,h,k,m,n,p){a=this;return a.f.W?a.f.W(b,c,d,e,f,g,h,k,m,n,p):a.f.call(null,b,c,d,e,f,g,h,k,m,n,p)}function p(a,b,c,d,e,f,g,h,k,m,n){a=this;return a.f.V?a.f.V(b,c,d,e,f,g,h,k,m,n):a.f.call(null,b,c,d,e,f,g,h,k,m,n)}function q(a,b,c,d,e,f,g,h,k,m){a=this;return a.f.fa?a.f.fa(b,c,d,e,f,g,h,k,m):a.f.call(null,b,c,d,e,f,g,h,k,m)}function r(a,b,c,d,e,f,g,h,k){a=this;return a.f.R?a.f.R(b,c,d,e,f,g,h,k):a.f.call(null,b,
c,d,e,f,g,h,k)}function s(a,b,c,d,e,f,g,h){a=this;return a.f.Q?a.f.Q(b,c,d,e,f,g,h):a.f.call(null,b,c,d,e,f,g,h)}function u(a,b,c,d,e,f,g){a=this;return a.f.t?a.f.t(b,c,d,e,f,g):a.f.call(null,b,c,d,e,f,g)}function x(a,b,c,d,e,f){a=this;return a.f.s?a.f.s(b,c,d,e,f):a.f.call(null,b,c,d,e,f)}function A(a,b,c,d,e){a=this;return a.f.i?a.f.i(b,c,d,e):a.f.call(null,b,c,d,e)}function G(a,b,c,d){a=this;return a.f.c?a.f.c(b,c,d):a.f.call(null,b,c,d)}function M(a,b,c){a=this;return a.f.b?a.f.b(b,c):a.f.call(null,
b,c)}function P(a,b){a=this;return a.f.a?a.f.a(b):a.f.call(null,b)}function ja(a){a=this;return a.f.m?a.f.m():a.f.call(null)}var D=null,D=function(za,W,Z,ea,ca,fa,ga,la,pa,ta,xa,ya,Aa,D,Fa,Xa,db,Ya,Ab,gc,Sc,ae){switch(arguments.length){case 1:return ja.call(this,za);case 2:return P.call(this,za,W);case 3:return M.call(this,za,W,Z);case 4:return G.call(this,za,W,Z,ea);case 5:return A.call(this,za,W,Z,ea,ca);case 6:return x.call(this,za,W,Z,ea,ca,fa);case 7:return u.call(this,za,W,Z,ea,ca,fa,ga);case 8:return s.call(this,
za,W,Z,ea,ca,fa,ga,la);case 9:return r.call(this,za,W,Z,ea,ca,fa,ga,la,pa);case 10:return q.call(this,za,W,Z,ea,ca,fa,ga,la,pa,ta);case 11:return p.call(this,za,W,Z,ea,ca,fa,ga,la,pa,ta,xa);case 12:return n.call(this,za,W,Z,ea,ca,fa,ga,la,pa,ta,xa,ya);case 13:return m.call(this,za,W,Z,ea,ca,fa,ga,la,pa,ta,xa,ya,Aa);case 14:return k.call(this,za,W,Z,ea,ca,fa,ga,la,pa,ta,xa,ya,Aa,D);case 15:return h.call(this,za,W,Z,ea,ca,fa,ga,la,pa,ta,xa,ya,Aa,D,Fa);case 16:return g.call(this,za,W,Z,ea,ca,fa,ga,la,
pa,ta,xa,ya,Aa,D,Fa,Xa);case 17:return f.call(this,za,W,Z,ea,ca,fa,ga,la,pa,ta,xa,ya,Aa,D,Fa,Xa,db);case 18:return e.call(this,za,W,Z,ea,ca,fa,ga,la,pa,ta,xa,ya,Aa,D,Fa,Xa,db,Ya);case 19:return d.call(this,za,W,Z,ea,ca,fa,ga,la,pa,ta,xa,ya,Aa,D,Fa,Xa,db,Ya,Ab);case 20:return c.call(this,za,W,Z,ea,ca,fa,ga,la,pa,ta,xa,ya,Aa,D,Fa,Xa,db,Ya,Ab,gc);case 21:return b.call(this,za,W,Z,ea,ca,fa,ga,la,pa,ta,xa,ya,Aa,D,Fa,Xa,db,Ya,Ab,gc,Sc);case 22:return a.call(this,za,W,Z,ea,ca,fa,ga,la,pa,ta,xa,ya,Aa,D,Fa,
Xa,db,Ya,Ab,gc,Sc,ae)}throw Error("Invalid arity: "+arguments.length);};D.a=ja;D.b=P;D.c=M;D.i=G;D.s=A;D.t=x;D.Q=u;D.R=s;D.fa=r;D.V=q;D.W=p;D.X=n;D.Y=m;D.Z=k;D.$=h;D.aa=g;D.ba=f;D.ca=e;D.da=d;D.ea=c;D.Jb=b;D.fb=a;return D}();l.apply=function(a,b){return this.call.apply(this,[this].concat(Na(b)))};l.m=function(){return this.f.m?this.f.m():this.f.call(null)};l.a=function(a){return this.f.a?this.f.a(a):this.f.call(null,a)};l.b=function(a,b){return this.f.b?this.f.b(a,b):this.f.call(null,a,b)};
l.c=function(a,b,c){return this.f.c?this.f.c(a,b,c):this.f.call(null,a,b,c)};l.i=function(a,b,c,d){return this.f.i?this.f.i(a,b,c,d):this.f.call(null,a,b,c,d)};l.s=function(a,b,c,d,e){return this.f.s?this.f.s(a,b,c,d,e):this.f.call(null,a,b,c,d,e)};l.t=function(a,b,c,d,e,f){return this.f.t?this.f.t(a,b,c,d,e,f):this.f.call(null,a,b,c,d,e,f)};l.Q=function(a,b,c,d,e,f,g){return this.f.Q?this.f.Q(a,b,c,d,e,f,g):this.f.call(null,a,b,c,d,e,f,g)};
l.R=function(a,b,c,d,e,f,g,h){return this.f.R?this.f.R(a,b,c,d,e,f,g,h):this.f.call(null,a,b,c,d,e,f,g,h)};l.fa=function(a,b,c,d,e,f,g,h,k){return this.f.fa?this.f.fa(a,b,c,d,e,f,g,h,k):this.f.call(null,a,b,c,d,e,f,g,h,k)};l.V=function(a,b,c,d,e,f,g,h,k,m){return this.f.V?this.f.V(a,b,c,d,e,f,g,h,k,m):this.f.call(null,a,b,c,d,e,f,g,h,k,m)};l.W=function(a,b,c,d,e,f,g,h,k,m,n){return this.f.W?this.f.W(a,b,c,d,e,f,g,h,k,m,n):this.f.call(null,a,b,c,d,e,f,g,h,k,m,n)};
l.X=function(a,b,c,d,e,f,g,h,k,m,n,p){return this.f.X?this.f.X(a,b,c,d,e,f,g,h,k,m,n,p):this.f.call(null,a,b,c,d,e,f,g,h,k,m,n,p)};l.Y=function(a,b,c,d,e,f,g,h,k,m,n,p,q){return this.f.Y?this.f.Y(a,b,c,d,e,f,g,h,k,m,n,p,q):this.f.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q)};l.Z=function(a,b,c,d,e,f,g,h,k,m,n,p,q,r){return this.f.Z?this.f.Z(a,b,c,d,e,f,g,h,k,m,n,p,q,r):this.f.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q,r)};
l.$=function(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s){return this.f.$?this.f.$(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s):this.f.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q,r,s)};l.aa=function(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u){return this.f.aa?this.f.aa(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u):this.f.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u)};l.ba=function(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x){return this.f.ba?this.f.ba(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x):this.f.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x)};
l.ca=function(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A){return this.f.ca?this.f.ca(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A):this.f.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A)};l.da=function(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G){return this.f.da?this.f.da(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G):this.f.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G)};
l.ea=function(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G,M){return this.f.ea?this.f.ea(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G,M):this.f.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G,M)};l.Jb=function(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G,M,P){var ja=this.f;return S.fb?S.fb(ja,a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G,M,P):S.call(null,ja,a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G,M,P)};l.Lc=!0;l.F=function(a,b){return new Mc(this.f,b)};l.A=function(){return this.o};
function Nc(a,b){return Lc(a)&&!(a?a.j&262144||a.yd||(a.j?0:y(vb,a)):y(vb,a))?new Mc(a,b):null==a?null:wb(a,b)}function Oc(a){var b=null!=a;return(b?a?a.j&131072||a.Tc||(a.j?0:y(sb,a)):y(sb,a):b)?ub(a):null}
var Pc=function(){function a(a,b){return null==a?null:ob(a,b)}var b=null,c=function(){function a(b,d,h){var k=null;if(2<arguments.length){for(var k=0,m=Array(arguments.length-2);k<m.length;)m[k]=arguments[k+2],++k;k=new F(m,0)}return c.call(this,b,d,k)}function c(a,d,e){for(;;){if(null==a)return null;a=b.b(a,d);if(w(e))d=H(e),e=J(e);else return a}}a.l=2;a.h=function(a){var b=H(a);a=J(a);var d=H(a);a=I(a);return c(b,d,a)};a.d=c;return a}(),b=function(b,e,f){switch(arguments.length){case 1:return b;
case 2:return a.call(this,b,e);default:var g=null;if(2<arguments.length){for(var g=0,h=Array(arguments.length-2);g<h.length;)h[g]=arguments[g+2],++g;g=new F(h,0)}return c.d(b,e,g)}throw Error("Invalid arity: "+arguments.length);};b.l=2;b.h=c.h;b.a=function(a){return a};b.b=a;b.d=c.d;return b}();function Qc(a){return null==a?!1:a?a.j&8||a.rd?!0:a.j?!1:y(Va,a):y(Va,a)}function Rc(a){return null==a?!1:a?a.j&4096||a.wd?!0:a.j?!1:y(nb,a):y(nb,a)}
function Tc(a){return a?a.j&16777216||a.vd?!0:a.j?!1:y(Eb,a):y(Eb,a)}function Uc(a){return null==a?!1:a?a.j&1024||a.Rc?!0:a.j?!1:y(ib,a):y(ib,a)}function Vc(a){return a?a.j&16384||a.xd?!0:a.j?!1:y(pb,a):y(pb,a)}function Wc(a){return a?a.q&512||a.qd?!0:!1:!1}function Xc(a){var b=[];na(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}function Yc(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,e-=1,b+=1}function Zc(a,b,c,d,e){b+=e-1;for(d+=e-1;0!==e;)c[d]=a[b],d-=1,e-=1,b-=1}var $c={};
function ad(a){return null==a?!1:a?a.j&64||a.jb?!0:a.j?!1:y($a,a):y($a,a)}function bd(a){return w(a)?!0:!1}function cd(a,b){return R.c(a,b,$c)===$c?!1:!0}function dd(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if(Ka(a)===Ka(b))return a&&(a.q&2048||a.sb)?a.tb(null,b):sa(a,b);throw Error("compare on non-nil objects of different types");}
var ed=function(){function a(a,b,c,g){for(;;){var h=dd(Q.b(a,g),Q.b(b,g));if(0===h&&g+1<c)g+=1;else return h}}function b(a,b){var f=O(a),g=O(b);return f<g?-1:f>g?1:c.i(a,b,f,0)}var c=null,c=function(c,e,f,g){switch(arguments.length){case 2:return b.call(this,c,e);case 4:return a.call(this,c,e,f,g)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.i=a;return c}(),fd=function(){function a(a,b,c){for(c=E(c);;)if(c){var g=H(c);b=a.b?a.b(b,g):a.call(null,b,g);if(xc(b))return rb(b);c=J(c)}else return b}
function b(a,b){var c=E(b);if(c){var g=H(c),c=J(c);return Pa.c?Pa.c(a,g,c):Pa.call(null,a,g,c)}return a.m?a.m():a.call(null)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}(),Pa=function(){function a(a,b,c){return c&&(c.j&524288||c.Vc)?c.ka(null,a,b):c instanceof Array?zc.c(c,a,b):"string"===typeof c?zc.c(c,a,b):y(xb,c)?yb.c(c,a,b):fd.c(a,b,c)}function b(a,
b){return b&&(b.j&524288||b.Vc)?b.ja(null,a):b instanceof Array?zc.b(b,a):"string"===typeof b?zc.b(b,a):y(xb,b)?yb.b(b,a):fd.b(a,b)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();function gd(a){return a}
var hd=function(){function a(a,b,c,g){a=a.a?a.a(b):a.call(null,b);c=Pa.c(a,c,g);return a.a?a.a(c):a.call(null,c)}function b(a,b,f){return c.i(a,b,b.m?b.m():b.call(null),f)}var c=null,c=function(c,e,f,g){switch(arguments.length){case 3:return b.call(this,c,e,f);case 4:return a.call(this,c,e,f,g)}throw Error("Invalid arity: "+arguments.length);};c.c=b;c.i=a;return c}(),id=function(){var a=null,b=function(){function b(a,c,g){var h=null;if(2<arguments.length){for(var h=0,k=Array(arguments.length-2);h<
k.length;)k[h]=arguments[h+2],++h;h=new F(k,0)}return d.call(this,a,c,h)}function d(b,c,d){return Pa.c(a,b+c,d)}b.l=2;b.h=function(a){var b=H(a);a=J(a);var c=H(a);a=I(a);return d(b,c,a)};b.d=d;return b}(),a=function(a,d,e){switch(arguments.length){case 0:return 0;case 1:return a;case 2:return a+d;default:var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new F(g,0)}return b.d(a,d,f)}throw Error("Invalid arity: "+arguments.length);};a.l=
2;a.h=b.h;a.m=function(){return 0};a.a=function(a){return a};a.b=function(a,b){return a+b};a.d=b.d;return a}(),jd=function(){var a=null,b=function(){function b(a,c,g){var h=null;if(2<arguments.length){for(var h=0,k=Array(arguments.length-2);h<k.length;)k[h]=arguments[h+2],++h;h=new F(k,0)}return d.call(this,a,c,h)}function d(b,c,d){return Pa.c(a,b-c,d)}b.l=2;b.h=function(a){var b=H(a);a=J(a);var c=H(a);a=I(a);return d(b,c,a)};b.d=d;return b}(),a=function(a,d,e){switch(arguments.length){case 1:return-a;
case 2:return a-d;default:var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new F(g,0)}return b.d(a,d,f)}throw Error("Invalid arity: "+arguments.length);};a.l=2;a.h=b.h;a.a=function(a){return-a};a.b=function(a,b){return a-b};a.d=b.d;return a}();function kd(a,b){var c=(a-a%b)/b;return 0<=c?Math.floor.a?Math.floor.a(c):Math.floor.call(null,c):Math.ceil.a?Math.ceil.a(c):Math.ceil.call(null,c)}
function ld(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function md(a){var b=1;for(a=E(a);;)if(a&&0<b)b-=1,a=J(a);else return a}
var B=function(){function a(a){return null==a?"":ma(a)}var b=null,c=function(){function a(b,d){var h=null;if(1<arguments.length){for(var h=0,k=Array(arguments.length-1);h<k.length;)k[h]=arguments[h+1],++h;h=new F(k,0)}return c.call(this,b,h)}function c(a,d){for(var e=new oa(b.a(a)),k=d;;)if(w(k))e=e.append(b.a(H(k))),k=J(k);else return e.toString()}a.l=1;a.h=function(a){var b=H(a);a=I(a);return c(b,a)};a.d=c;return a}(),b=function(b,e){switch(arguments.length){case 0:return"";case 1:return a.call(this,
b);default:var f=null;if(1<arguments.length){for(var f=0,g=Array(arguments.length-1);f<g.length;)g[f]=arguments[f+1],++f;f=new F(g,0)}return c.d(b,f)}throw Error("Invalid arity: "+arguments.length);};b.l=1;b.h=c.h;b.m=function(){return""};b.a=a;b.d=c.d;return b}();function Dc(a,b){var c;if(Tc(b))if(Ac(a)&&Ac(b)&&O(a)!==O(b))c=!1;else a:{c=E(a);for(var d=E(b);;){if(null==c){c=null==d;break a}if(null!=d&&oc.b(H(c),H(d)))c=J(c),d=J(d);else{c=!1;break a}}c=void 0}else c=null;return bd(c)}
function nd(a){var b=0;for(a=E(a);;)if(a){var c=H(a),b=(b+(ic(function(){var a=c;return od.a?od.a(a):od.call(null,a)}())^ic(function(){var a=c;return pd.a?pd.a(a):pd.call(null,a)}())))%4503599627370496;a=J(a)}else return b}function qd(a,b,c,d,e){this.o=a;this.first=b;this.Ia=c;this.count=d;this.n=e;this.j=65937646;this.q=8192}l=qd.prototype;l.toString=function(){return $b(this)};l.A=function(){return this.o};l.la=function(){return 1===this.count?null:this.Ia};l.O=function(){return this.count};
l.D=function(){var a=this.n;return null!=a?a:this.n=a=sc(this)};l.C=function(a,b){return Dc(this,b)};l.U=function(){return wb(nc,this.o)};l.ja=function(a,b){return fd.b(b,this)};l.ka=function(a,b,c){return fd.c(b,c,this)};l.ga=function(){return this.first};l.sa=function(){return 1===this.count?nc:this.Ia};l.M=function(){return this};l.F=function(a,b){return new qd(b,this.first,this.Ia,this.count,this.n)};l.N=function(a,b){return new qd(this.o,b,this,this.count+1,null)};qd.prototype[Ma]=function(){return qc(this)};
function rd(a){this.o=a;this.j=65937614;this.q=8192}l=rd.prototype;l.toString=function(){return $b(this)};l.A=function(){return this.o};l.la=function(){return null};l.O=function(){return 0};l.D=function(){return tc};l.C=function(a,b){return Dc(this,b)};l.U=function(){return this};l.ja=function(a,b){return fd.b(b,this)};l.ka=function(a,b,c){return fd.c(b,c,this)};l.ga=function(){return null};l.sa=function(){return nc};l.M=function(){return null};l.F=function(a,b){return new rd(b)};
l.N=function(a,b){return new qd(this.o,b,null,1,null)};var nc=new rd(null);rd.prototype[Ma]=function(){return qc(this)};
var sd=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new F(e,0)}return b.call(this,d)}function b(a){var b;if(a instanceof F&&0===a.p)b=a.e;else a:{for(b=[];;)if(null!=a)b.push(a.ga(null)),a=a.la(null);else break a;b=void 0}a=b.length;for(var e=nc;;)if(0<a){var f=a-1,e=e.N(null,b[a-1]);a=f}else return e}a.l=0;a.h=function(a){a=E(a);return b(a)};a.d=b;return a}();
function td(a,b,c,d){this.o=a;this.first=b;this.Ia=c;this.n=d;this.j=65929452;this.q=8192}l=td.prototype;l.toString=function(){return $b(this)};l.A=function(){return this.o};l.la=function(){return null==this.Ia?null:E(this.Ia)};l.D=function(){var a=this.n;return null!=a?a:this.n=a=sc(this)};l.C=function(a,b){return Dc(this,b)};l.U=function(){return Nc(nc,this.o)};l.ja=function(a,b){return fd.b(b,this)};l.ka=function(a,b,c){return fd.c(b,c,this)};l.ga=function(){return this.first};
l.sa=function(){return null==this.Ia?nc:this.Ia};l.M=function(){return this};l.F=function(a,b){return new td(b,this.first,this.Ia,this.n)};l.N=function(a,b){return new td(null,b,this,this.n)};td.prototype[Ma]=function(){return qc(this)};function L(a,b){var c=null==b;return(c?c:b&&(b.j&64||b.jb))?new td(null,a,b,null):new td(null,a,E(b),null)}
function ud(a,b){if(a.qa===b.qa)return 0;var c=Ja(a.na);if(w(c?b.na:c))return-1;if(w(a.na)){if(Ja(b.na))return 1;c=sa(a.na,b.na);return 0===c?sa(a.name,b.name):c}return sa(a.name,b.name)}function T(a,b,c,d){this.na=a;this.name=b;this.qa=c;this.Va=d;this.j=2153775105;this.q=4096}l=T.prototype;l.w=function(a,b){return Fb(b,[B(":"),B(this.qa)].join(""))};l.hb=function(){return this.name};l.ib=function(){return this.na};l.D=function(){var a=this.Va;return null!=a?a:this.Va=a=jc(this)+2654435769|0};
l.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return R.b(c,this);case 3:return R.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return R.b(c,this)};a.c=function(a,c,d){return R.c(c,this,d)};return a}();l.apply=function(a,b){return this.call.apply(this,[this].concat(Na(b)))};l.a=function(a){return R.b(a,this)};l.b=function(a,b){return R.c(a,this,b)};l.C=function(a,b){return b instanceof T?this.qa===b.qa:!1};
l.toString=function(){return[B(":"),B(this.qa)].join("")};function vd(a,b){return a===b?!0:a instanceof T&&b instanceof T?a.qa===b.qa:!1}
var yd=function(){function a(a,b){return new T(a,b,[B(w(a)?[B(a),B("/")].join(""):null),B(b)].join(""),null)}function b(a){if(a instanceof T)return a;if(a instanceof lc){var b;if(a&&(a.q&4096||a.Uc))b=a.ib(null);else throw Error([B("Doesn't support namespace: "),B(a)].join(""));return new T(b,wd.a?wd.a(a):wd.call(null,a),a.str,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new T(b[0],b[1],a,null):new T(null,b[0],a,null)):null}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,
c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}();function zd(a,b,c,d){this.o=a;this.bb=b;this.K=c;this.n=d;this.q=0;this.j=32374988}l=zd.prototype;l.toString=function(){return $b(this)};function Ad(a){null!=a.bb&&(a.K=a.bb.m?a.bb.m():a.bb.call(null),a.bb=null);return a.K}l.A=function(){return this.o};l.la=function(){Db(this);return null==this.K?null:J(this.K)};l.D=function(){var a=this.n;return null!=a?a:this.n=a=sc(this)};
l.C=function(a,b){return Dc(this,b)};l.U=function(){return Nc(nc,this.o)};l.ja=function(a,b){return fd.b(b,this)};l.ka=function(a,b,c){return fd.c(b,c,this)};l.ga=function(){Db(this);return null==this.K?null:H(this.K)};l.sa=function(){Db(this);return null!=this.K?I(this.K):nc};l.M=function(){Ad(this);if(null==this.K)return null;for(var a=this.K;;)if(a instanceof zd)a=Ad(a);else return this.K=a,E(this.K)};l.F=function(a,b){return new zd(b,this.bb,this.K,this.n)};l.N=function(a,b){return L(b,this)};
zd.prototype[Ma]=function(){return qc(this)};function Bd(a,b){this.H=a;this.end=b;this.q=0;this.j=2}Bd.prototype.O=function(){return this.end};Bd.prototype.add=function(a){this.H[this.end]=a;return this.end+=1};Bd.prototype.P=function(){var a=new Cd(this.H,0,this.end);this.H=null;return a};function Dd(a){return new Bd(Array(a),0)}function Cd(a,b,c){this.e=a;this.ha=b;this.end=c;this.q=0;this.j=524306}l=Cd.prototype;l.ja=function(a,b){return zc.i(this.e,b,this.e[this.ha],this.ha+1)};
l.ka=function(a,b,c){return zc.i(this.e,b,c,this.ha)};l.Rb=function(){if(this.ha===this.end)throw Error("-drop-first of empty chunk");return new Cd(this.e,this.ha+1,this.end)};l.v=function(a,b){return this.e[this.ha+b]};l.ta=function(a,b,c){return 0<=b&&b<this.end-this.ha?this.e[this.ha+b]:c};l.O=function(){return this.end-this.ha};
var Ed=function(){function a(a,b,c){return new Cd(a,b,c)}function b(a,b){return new Cd(a,b,a.length)}function c(a){return new Cd(a,0,a.length)}var d=null,d=function(d,f,g){switch(arguments.length){case 1:return c.call(this,d);case 2:return b.call(this,d,f);case 3:return a.call(this,d,f,g)}throw Error("Invalid arity: "+arguments.length);};d.a=c;d.b=b;d.c=a;return d}();function Fd(a,b,c,d){this.P=a;this.Fa=b;this.o=c;this.n=d;this.j=31850732;this.q=1536}l=Fd.prototype;l.toString=function(){return $b(this)};
l.A=function(){return this.o};l.la=function(){if(1<Ta(this.P))return new Fd(Qb(this.P),this.Fa,this.o,null);var a=Db(this.Fa);return null==a?null:a};l.D=function(){var a=this.n;return null!=a?a:this.n=a=sc(this)};l.C=function(a,b){return Dc(this,b)};l.U=function(){return Nc(nc,this.o)};l.ga=function(){return C.b(this.P,0)};l.sa=function(){return 1<Ta(this.P)?new Fd(Qb(this.P),this.Fa,this.o,null):null==this.Fa?nc:this.Fa};l.M=function(){return this};l.Hb=function(){return this.P};
l.Ib=function(){return null==this.Fa?nc:this.Fa};l.F=function(a,b){return new Fd(this.P,this.Fa,b,this.n)};l.N=function(a,b){return L(b,this)};l.Gb=function(){return null==this.Fa?null:this.Fa};Fd.prototype[Ma]=function(){return qc(this)};function Gd(a,b){return 0===Ta(a)?b:new Fd(a,b,null,null)}function Hd(a,b){a.add(b)}function Id(a){for(var b=[];;)if(E(a))b.push(H(a)),a=J(a);else return b}function Jd(a,b){if(Ac(a))return O(a);for(var c=a,d=b,e=0;;)if(0<d&&E(c))c=J(c),d-=1,e+=1;else return e}
var Ld=function Kd(b){return null==b?null:null==J(b)?E(H(b)):L(H(b),Kd(J(b)))},Md=function(){function a(a,b){return new zd(null,function(){var c=E(a);return c?Wc(c)?Gd(Rb(c),d.b(Sb(c),b)):L(H(c),d.b(I(c),b)):b},null,null)}function b(a){return new zd(null,function(){return a},null,null)}function c(){return new zd(null,function(){return null},null,null)}var d=null,e=function(){function a(c,d,e){var f=null;if(2<arguments.length){for(var f=0,p=Array(arguments.length-2);f<p.length;)p[f]=arguments[f+2],
++f;f=new F(p,0)}return b.call(this,c,d,f)}function b(a,c,e){return function p(a,b){return new zd(null,function(){var c=E(a);return c?Wc(c)?Gd(Rb(c),p(Sb(c),b)):L(H(c),p(I(c),b)):w(b)?p(H(b),J(b)):null},null,null)}(d.b(a,c),e)}a.l=2;a.h=function(a){var c=H(a);a=J(a);var d=H(a);a=I(a);return b(c,d,a)};a.d=b;return a}(),d=function(d,g,h){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,d);case 2:return a.call(this,d,g);default:var k=null;if(2<arguments.length){for(var k=
0,m=Array(arguments.length-2);k<m.length;)m[k]=arguments[k+2],++k;k=new F(m,0)}return e.d(d,g,k)}throw Error("Invalid arity: "+arguments.length);};d.l=2;d.h=e.h;d.m=c;d.a=b;d.b=a;d.d=e.d;return d}(),Nd=function(){function a(a,b,c,d){return L(a,L(b,L(c,d)))}function b(a,b,c){return L(a,L(b,c))}var c=null,d=function(){function a(c,d,e,m,n){var p=null;if(4<arguments.length){for(var p=0,q=Array(arguments.length-4);p<q.length;)q[p]=arguments[p+4],++p;p=new F(q,0)}return b.call(this,c,d,e,m,p)}function b(a,
c,d,e,f){return L(a,L(c,L(d,L(e,Ld(f)))))}a.l=4;a.h=function(a){var c=H(a);a=J(a);var d=H(a);a=J(a);var e=H(a);a=J(a);var n=H(a);a=I(a);return b(c,d,e,n,a)};a.d=b;return a}(),c=function(c,f,g,h,k){switch(arguments.length){case 1:return E(c);case 2:return L(c,f);case 3:return b.call(this,c,f,g);case 4:return a.call(this,c,f,g,h);default:var m=null;if(4<arguments.length){for(var m=0,n=Array(arguments.length-4);m<n.length;)n[m]=arguments[m+4],++m;m=new F(n,0)}return d.d(c,f,g,h,m)}throw Error("Invalid arity: "+
arguments.length);};c.l=4;c.h=d.h;c.a=function(a){return E(a)};c.b=function(a,b){return L(a,b)};c.c=b;c.i=a;c.d=d.d;return c}();function Od(a){return Nb(a)}
var Pd=function(){function a(){return Lb(Fc)}var b=null,c=function(){function a(c,d,h){var k=null;if(2<arguments.length){for(var k=0,m=Array(arguments.length-2);k<m.length;)m[k]=arguments[k+2],++k;k=new F(m,0)}return b.call(this,c,d,k)}function b(a,c,d){for(;;)if(a=Mb(a,c),w(d))c=H(d),d=J(d);else return a}a.l=2;a.h=function(a){var c=H(a);a=J(a);var d=H(a);a=I(a);return b(c,d,a)};a.d=b;return a}(),b=function(b,e,f){switch(arguments.length){case 0:return a.call(this);case 1:return b;case 2:return Mb(b,
e);default:var g=null;if(2<arguments.length){for(var g=0,h=Array(arguments.length-2);g<h.length;)h[g]=arguments[g+2],++g;g=new F(h,0)}return c.d(b,e,g)}throw Error("Invalid arity: "+arguments.length);};b.l=2;b.h=c.h;b.m=a;b.a=function(a){return a};b.b=function(a,b){return Mb(a,b)};b.d=c.d;return b}(),Qd=function(){var a=null,b=function(){function a(c,f,g,h){var k=null;if(3<arguments.length){for(var k=0,m=Array(arguments.length-3);k<m.length;)m[k]=arguments[k+3],++k;k=new F(m,0)}return b.call(this,
c,f,g,k)}function b(a,c,d,h){for(;;)if(a=Ob(a,c,d),w(h))c=H(h),d=H(J(h)),h=J(J(h));else return a}a.l=3;a.h=function(a){var c=H(a);a=J(a);var g=H(a);a=J(a);var h=H(a);a=I(a);return b(c,g,h,a)};a.d=b;return a}(),a=function(a,d,e,f){switch(arguments.length){case 3:return Ob(a,d,e);default:var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new F(h,0)}return b.d(a,d,e,g)}throw Error("Invalid arity: "+arguments.length);};a.l=3;a.h=b.h;a.c=function(a,
b,e){return Ob(a,b,e)};a.d=b.d;return a}();
function Rd(a,b,c){var d=E(c);if(0===b)return a.m?a.m():a.call(null);c=ab(d);var e=bb(d);if(1===b)return a.a?a.a(c):a.a?a.a(c):a.call(null,c);var d=ab(e),f=bb(e);if(2===b)return a.b?a.b(c,d):a.b?a.b(c,d):a.call(null,c,d);var e=ab(f),g=bb(f);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var f=ab(g),h=bb(g);if(4===b)return a.i?a.i(c,d,e,f):a.i?a.i(c,d,e,f):a.call(null,c,d,e,f);var g=ab(h),k=bb(h);if(5===b)return a.s?a.s(c,d,e,f,g):a.s?a.s(c,d,e,f,g):a.call(null,c,d,e,f,g);var h=ab(k),
m=bb(k);if(6===b)return a.t?a.t(c,d,e,f,g,h):a.t?a.t(c,d,e,f,g,h):a.call(null,c,d,e,f,g,h);var k=ab(m),n=bb(m);if(7===b)return a.Q?a.Q(c,d,e,f,g,h,k):a.Q?a.Q(c,d,e,f,g,h,k):a.call(null,c,d,e,f,g,h,k);var m=ab(n),p=bb(n);if(8===b)return a.R?a.R(c,d,e,f,g,h,k,m):a.R?a.R(c,d,e,f,g,h,k,m):a.call(null,c,d,e,f,g,h,k,m);var n=ab(p),q=bb(p);if(9===b)return a.fa?a.fa(c,d,e,f,g,h,k,m,n):a.fa?a.fa(c,d,e,f,g,h,k,m,n):a.call(null,c,d,e,f,g,h,k,m,n);var p=ab(q),r=bb(q);if(10===b)return a.V?a.V(c,d,e,f,g,h,k,m,
n,p):a.V?a.V(c,d,e,f,g,h,k,m,n,p):a.call(null,c,d,e,f,g,h,k,m,n,p);var q=ab(r),s=bb(r);if(11===b)return a.W?a.W(c,d,e,f,g,h,k,m,n,p,q):a.W?a.W(c,d,e,f,g,h,k,m,n,p,q):a.call(null,c,d,e,f,g,h,k,m,n,p,q);var r=ab(s),u=bb(s);if(12===b)return a.X?a.X(c,d,e,f,g,h,k,m,n,p,q,r):a.X?a.X(c,d,e,f,g,h,k,m,n,p,q,r):a.call(null,c,d,e,f,g,h,k,m,n,p,q,r);var s=ab(u),x=bb(u);if(13===b)return a.Y?a.Y(c,d,e,f,g,h,k,m,n,p,q,r,s):a.Y?a.Y(c,d,e,f,g,h,k,m,n,p,q,r,s):a.call(null,c,d,e,f,g,h,k,m,n,p,q,r,s);var u=ab(x),A=
bb(x);if(14===b)return a.Z?a.Z(c,d,e,f,g,h,k,m,n,p,q,r,s,u):a.Z?a.Z(c,d,e,f,g,h,k,m,n,p,q,r,s,u):a.call(null,c,d,e,f,g,h,k,m,n,p,q,r,s,u);var x=ab(A),G=bb(A);if(15===b)return a.$?a.$(c,d,e,f,g,h,k,m,n,p,q,r,s,u,x):a.$?a.$(c,d,e,f,g,h,k,m,n,p,q,r,s,u,x):a.call(null,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x);var A=ab(G),M=bb(G);if(16===b)return a.aa?a.aa(c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A):a.aa?a.aa(c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A):a.call(null,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A);var G=ab(M),P=bb(M);if(17===b)return a.ba?
a.ba(c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G):a.ba?a.ba(c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G):a.call(null,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G);var M=ab(P),ja=bb(P);if(18===b)return a.ca?a.ca(c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G,M):a.ca?a.ca(c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G,M):a.call(null,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G,M);P=ab(ja);ja=bb(ja);if(19===b)return a.da?a.da(c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G,M,P):a.da?a.da(c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G,M,P):a.call(null,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G,M,P);var D=
ab(ja);bb(ja);if(20===b)return a.ea?a.ea(c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G,M,P,D):a.ea?a.ea(c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G,M,P,D):a.call(null,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G,M,P,D);throw Error("Only up to 20 arguments supported on functions");}
var S=function(){function a(a,b,c,d,e){b=Nd.i(b,c,d,e);c=a.l;return a.h?(d=Jd(b,c+1),d<=c?Rd(a,d,b):a.h(b)):a.apply(a,Id(b))}function b(a,b,c,d){b=Nd.c(b,c,d);c=a.l;return a.h?(d=Jd(b,c+1),d<=c?Rd(a,d,b):a.h(b)):a.apply(a,Id(b))}function c(a,b,c){b=Nd.b(b,c);c=a.l;if(a.h){var d=Jd(b,c+1);return d<=c?Rd(a,d,b):a.h(b)}return a.apply(a,Id(b))}function d(a,b){var c=a.l;if(a.h){var d=Jd(b,c+1);return d<=c?Rd(a,d,b):a.h(b)}return a.apply(a,Id(b))}var e=null,f=function(){function a(c,d,e,f,g,r){var s=null;
if(5<arguments.length){for(var s=0,u=Array(arguments.length-5);s<u.length;)u[s]=arguments[s+5],++s;s=new F(u,0)}return b.call(this,c,d,e,f,g,s)}function b(a,c,d,e,f,g){c=L(c,L(d,L(e,L(f,Ld(g)))));d=a.l;return a.h?(e=Jd(c,d+1),e<=d?Rd(a,e,c):a.h(c)):a.apply(a,Id(c))}a.l=5;a.h=function(a){var c=H(a);a=J(a);var d=H(a);a=J(a);var e=H(a);a=J(a);var f=H(a);a=J(a);var g=H(a);a=I(a);return b(c,d,e,f,g,a)};a.d=b;return a}(),e=function(e,h,k,m,n,p){switch(arguments.length){case 2:return d.call(this,e,h);case 3:return c.call(this,
e,h,k);case 4:return b.call(this,e,h,k,m);case 5:return a.call(this,e,h,k,m,n);default:var q=null;if(5<arguments.length){for(var q=0,r=Array(arguments.length-5);q<r.length;)r[q]=arguments[q+5],++q;q=new F(r,0)}return f.d(e,h,k,m,n,q)}throw Error("Invalid arity: "+arguments.length);};e.l=5;e.h=f.h;e.b=d;e.c=c;e.i=b;e.s=a;e.d=f.d;return e}(),Sd=function(){function a(a,b){return!oc.b(a,b)}var b=null,c=function(){function a(c,d,h){var k=null;if(2<arguments.length){for(var k=0,m=Array(arguments.length-
2);k<m.length;)m[k]=arguments[k+2],++k;k=new F(m,0)}return b.call(this,c,d,k)}function b(a,c,d){return Ja(S.i(oc,a,c,d))}a.l=2;a.h=function(a){var c=H(a);a=J(a);var d=H(a);a=I(a);return b(c,d,a)};a.d=b;return a}(),b=function(b,e,f){switch(arguments.length){case 1:return!1;case 2:return a.call(this,b,e);default:var g=null;if(2<arguments.length){for(var g=0,h=Array(arguments.length-2);g<h.length;)h[g]=arguments[g+2],++g;g=new F(h,0)}return c.d(b,e,g)}throw Error("Invalid arity: "+arguments.length);
};b.l=2;b.h=c.h;b.a=function(){return!1};b.b=a;b.d=c.d;return b}();function Td(a){return E(a)?a:null}function Ud(a,b){for(;;){if(null==E(b))return!0;var c;c=H(b);c=a.a?a.a(c):a.call(null,c);if(w(c)){c=a;var d=J(b);a=c;b=d}else return!1}}function Vd(a){for(var b=gd;;)if(E(a)){var c;c=H(a);c=b.a?b.a(c):b.call(null,c);if(w(c))return c;a=J(a)}else return null}
function Wd(a){return function(){function b(b,c){return Ja(a.b?a.b(b,c):a.call(null,b,c))}function c(b){return Ja(a.a?a.a(b):a.call(null,b))}function d(){return Ja(a.m?a.m():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new F(g,0)}return c.call(this,a,d,f)}function c(b,d,e){return Ja(S.i(a,b,d,e))}b.l=2;b.h=function(a){var b=H(a);a=J(a);var d=H(a);a=I(a);return c(b,d,a)};b.d=c;
return b}(),e=function(a,e,k){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new F(n,0)}return f.d(a,e,m)}throw Error("Invalid arity: "+arguments.length);};e.l=2;e.h=f.h;e.m=d;e.a=c;e.b=b;e.d=f.d;return e}()}
function Xd(){return function(){function a(a){if(0<arguments.length)for(var c=0,d=Array(arguments.length-0);c<d.length;)d[c]=arguments[c+0],++c;return!1}a.l=0;a.h=function(a){E(a);return!1};a.d=function(){return!1};return a}()}
var Yd=function(){function a(a,b,c,d){return function(){function e(m,n,p){return a.t?a.t(b,c,d,m,n,p):a.call(null,b,c,d,m,n,p)}function n(e,m){return a.s?a.s(b,c,d,e,m):a.call(null,b,c,d,e,m)}function p(e){return a.i?a.i(b,c,d,e):a.call(null,b,c,d,e)}function q(){return a.c?a.c(b,c,d):a.call(null,b,c,d)}var r=null,s=function(){function e(a,b,c,d){var f=null;if(3<arguments.length){for(var f=0,g=Array(arguments.length-3);f<g.length;)g[f]=arguments[f+3],++f;f=new F(g,0)}return m.call(this,a,b,c,f)}function m(e,
n,p,r){return S.d(a,b,c,d,e,N([n,p,r],0))}e.l=3;e.h=function(a){var b=H(a);a=J(a);var c=H(a);a=J(a);var d=H(a);a=I(a);return m(b,c,d,a)};e.d=m;return e}(),r=function(a,b,c,d){switch(arguments.length){case 0:return q.call(this);case 1:return p.call(this,a);case 2:return n.call(this,a,b);case 3:return e.call(this,a,b,c);default:var f=null;if(3<arguments.length){for(var f=0,g=Array(arguments.length-3);f<g.length;)g[f]=arguments[f+3],++f;f=new F(g,0)}return s.d(a,b,c,f)}throw Error("Invalid arity: "+
arguments.length);};r.l=3;r.h=s.h;r.m=q;r.a=p;r.b=n;r.c=e;r.d=s.d;return r}()}function b(a,b,c){return function(){function d(e,k,m){return a.s?a.s(b,c,e,k,m):a.call(null,b,c,e,k,m)}function e(d,k){return a.i?a.i(b,c,d,k):a.call(null,b,c,d,k)}function n(d){return a.c?a.c(b,c,d):a.call(null,b,c,d)}function p(){return a.b?a.b(b,c):a.call(null,b,c)}var q=null,r=function(){function d(a,b,c,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;
g=new F(h,0)}return e.call(this,a,b,c,g)}function e(d,k,m,n){return S.d(a,b,c,d,k,N([m,n],0))}d.l=3;d.h=function(a){var b=H(a);a=J(a);var c=H(a);a=J(a);var d=H(a);a=I(a);return e(b,c,d,a)};d.d=e;return d}(),q=function(a,b,c,f){switch(arguments.length){case 0:return p.call(this);case 1:return n.call(this,a);case 2:return e.call(this,a,b);case 3:return d.call(this,a,b,c);default:var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new F(h,0)}return r.d(a,
b,c,g)}throw Error("Invalid arity: "+arguments.length);};q.l=3;q.h=r.h;q.m=p;q.a=n;q.b=e;q.c=d;q.d=r.d;return q}()}function c(a,b){return function(){function c(d,e,h){return a.i?a.i(b,d,e,h):a.call(null,b,d,e,h)}function d(c,e){return a.c?a.c(b,c,e):a.call(null,b,c,e)}function e(c){return a.b?a.b(b,c):a.call(null,b,c)}function n(){return a.a?a.a(b):a.call(null,b)}var p=null,q=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=
arguments[g+3],++g;g=new F(h,0)}return d.call(this,a,b,e,g)}function d(c,e,h,k){return S.d(a,b,c,e,h,N([k],0))}c.l=3;c.h=function(a){var b=H(a);a=J(a);var c=H(a);a=J(a);var e=H(a);a=I(a);return d(b,c,e,a)};c.d=d;return c}(),p=function(a,b,f,g){switch(arguments.length){case 0:return n.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,f);default:var p=null;if(3<arguments.length){for(var p=0,G=Array(arguments.length-3);p<G.length;)G[p]=arguments[p+3],
++p;p=new F(G,0)}return q.d(a,b,f,p)}throw Error("Invalid arity: "+arguments.length);};p.l=3;p.h=q.h;p.m=n;p.a=e;p.b=d;p.c=c;p.d=q.d;return p}()}var d=null,e=function(){function a(c,d,e,f,p){var q=null;if(4<arguments.length){for(var q=0,r=Array(arguments.length-4);q<r.length;)r[q]=arguments[q+4],++q;q=new F(r,0)}return b.call(this,c,d,e,f,q)}function b(a,c,d,e,f){return function(){function b(a){var c=null;if(0<arguments.length){for(var c=0,d=Array(arguments.length-0);c<d.length;)d[c]=arguments[c+
0],++c;c=new F(d,0)}return g.call(this,c)}function g(b){return S.s(a,c,d,e,Md.b(f,b))}b.l=0;b.h=function(a){a=E(a);return g(a)};b.d=g;return b}()}a.l=4;a.h=function(a){var c=H(a);a=J(a);var d=H(a);a=J(a);var e=H(a);a=J(a);var f=H(a);a=I(a);return b(c,d,e,f,a)};a.d=b;return a}(),d=function(d,g,h,k,m){switch(arguments.length){case 1:return d;case 2:return c.call(this,d,g);case 3:return b.call(this,d,g,h);case 4:return a.call(this,d,g,h,k);default:var n=null;if(4<arguments.length){for(var n=0,p=Array(arguments.length-
4);n<p.length;)p[n]=arguments[n+4],++n;n=new F(p,0)}return e.d(d,g,h,k,n)}throw Error("Invalid arity: "+arguments.length);};d.l=4;d.h=e.h;d.a=function(a){return a};d.b=c;d.c=b;d.i=a;d.d=e.d;return d}();function Zd(a,b,c,d){this.state=a;this.o=b;this.pd=c;this.cb=d;this.j=6455296;this.q=16386}l=Zd.prototype;l.D=function(){return this[ba]||(this[ba]=++da)};
l.Xb=function(a,b,c){for(var d=E(this.cb),e=null,f=0,g=0;;)if(g<f){a=e.v(null,g);var h=Q.c(a,0,null);a=Q.c(a,1,null);var k=b,m=c;a.i?a.i(h,this,k,m):a.call(null,h,this,k,m);g+=1}else if(a=E(d))d=a,Wc(d)?(e=Rb(d),d=Sb(d),a=e,f=O(e),e=a):(a=H(d),h=Q.c(a,0,null),a=Q.c(a,1,null),e=h,f=b,g=c,a.i?a.i(e,this,f,g):a.call(null,e,this,f,g),d=J(d),e=null,f=0),g=0;else return null};l.Wb=function(a,b,c){this.cb=Jc.c(this.cb,b,c);return this};l.Yb=function(a,b){return this.cb=Kc.b(this.cb,b)};l.A=function(){return this.o};
l.Wa=function(){return this.state};l.C=function(a,b){return this===b};
var U=function(){function a(a){return new Zd(a,null,null,null)}var b=null,c=function(){function a(c,d){var h=null;if(1<arguments.length){for(var h=0,k=Array(arguments.length-1);h<k.length;)k[h]=arguments[h+1],++h;h=new F(k,0)}return b.call(this,c,h)}function b(a,c){var d=ad(c)?S.b($d,c):c,e=R.b(d,be),d=R.b(d,Ga);return new Zd(a,d,e,null)}a.l=1;a.h=function(a){var c=H(a);a=I(a);return b(c,a)};a.d=b;return a}(),b=function(b,e){switch(arguments.length){case 1:return a.call(this,b);default:var f=null;
if(1<arguments.length){for(var f=0,g=Array(arguments.length-1);f<g.length;)g[f]=arguments[f+1],++f;f=new F(g,0)}return c.d(b,f)}throw Error("Invalid arity: "+arguments.length);};b.l=1;b.h=c.h;b.a=a;b.d=c.d;return b}();
function ce(a,b){if(a instanceof Zd){var c=a.pd;if(null!=c&&!w(c.a?c.a(b):c.call(null,b)))throw Error([B("Assert failed: "),B("Validator rejected reference state"),B("\n"),B(function(){var a=sd(new lc(null,"validate","validate",1439230700,null),new lc(null,"new-value","new-value",-1567397401,null));return de.a?de.a(a):de.call(null,a)}())].join(""));c=a.state;a.state=b;null!=a.cb&&Ib(a,c,b);return b}return Wb(a,b)}
var ee=function(){function a(a,b,c,d){if(a instanceof Zd){var e=a.state;b=b.c?b.c(e,c,d):b.call(null,e,c,d);a=ce(a,b)}else a=Xb.i(a,b,c,d);return a}function b(a,b,c){if(a instanceof Zd){var d=a.state;b=b.b?b.b(d,c):b.call(null,d,c);a=ce(a,b)}else a=Xb.c(a,b,c);return a}function c(a,b){var c;a instanceof Zd?(c=a.state,c=b.a?b.a(c):b.call(null,c),c=ce(a,c)):c=Xb.b(a,b);return c}var d=null,e=function(){function a(c,d,e,f,p){var q=null;if(4<arguments.length){for(var q=0,r=Array(arguments.length-4);q<
r.length;)r[q]=arguments[q+4],++q;q=new F(r,0)}return b.call(this,c,d,e,f,q)}function b(a,c,d,e,f){return a instanceof Zd?ce(a,S.s(c,a.state,d,e,f)):Xb.s(a,c,d,e,f)}a.l=4;a.h=function(a){var c=H(a);a=J(a);var d=H(a);a=J(a);var e=H(a);a=J(a);var f=H(a);a=I(a);return b(c,d,e,f,a)};a.d=b;return a}(),d=function(d,g,h,k,m){switch(arguments.length){case 2:return c.call(this,d,g);case 3:return b.call(this,d,g,h);case 4:return a.call(this,d,g,h,k);default:var n=null;if(4<arguments.length){for(var n=0,p=Array(arguments.length-
4);n<p.length;)p[n]=arguments[n+4],++n;n=new F(p,0)}return e.d(d,g,h,k,n)}throw Error("Invalid arity: "+arguments.length);};d.l=4;d.h=e.h;d.b=c;d.c=b;d.i=a;d.d=e.d;return d}();function fe(a){this.state=a;this.q=0;this.j=32768}fe.prototype.Wa=function(){return this.state};fe.prototype.ad=function(a){return this.state=a};
var ge=function(){function a(a,b,c,d){return new zd(null,function(){var f=E(b),p=E(c),q=E(d);if(f&&p&&q){var r=L,s;s=H(f);var u=H(p),x=H(q);s=a.c?a.c(s,u,x):a.call(null,s,u,x);f=r(s,e.i(a,I(f),I(p),I(q)))}else f=null;return f},null,null)}function b(a,b,c){return new zd(null,function(){var d=E(b),f=E(c);if(d&&f){var p=L,q;q=H(d);var r=H(f);q=a.b?a.b(q,r):a.call(null,q,r);d=p(q,e.c(a,I(d),I(f)))}else d=null;return d},null,null)}function c(a,b){return new zd(null,function(){var c=E(b);if(c){if(Wc(c)){for(var d=
Rb(c),f=O(d),p=Dd(f),q=0;;)if(q<f)Hd(p,function(){var b=C.b(d,q);return a.a?a.a(b):a.call(null,b)}()),q+=1;else break;return Gd(p.P(),e.b(a,Sb(c)))}return L(function(){var b=H(c);return a.a?a.a(b):a.call(null,b)}(),e.b(a,I(c)))}return null},null,null)}function d(a){return function(b){return function(){function c(d,e){var f=a.a?a.a(e):a.call(null,e);return b.b?b.b(d,f):b.call(null,d,f)}function d(a){return b.a?b.a(a):b.call(null,a)}function e(){return b.m?b.m():b.call(null)}var f=null,q=function(){function c(a,
b,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new F(g,0)}return d.call(this,a,b,f)}function d(c,e,f){e=S.c(a,e,f);return b.b?b.b(c,e):b.call(null,c,e)}c.l=2;c.h=function(a){var b=H(a);a=J(a);var c=H(a);a=I(a);return d(b,c,a)};c.d=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var g=null;if(2<arguments.length){for(var g=0,h=
Array(arguments.length-2);g<h.length;)h[g]=arguments[g+2],++g;g=new F(h,0)}return q.d(a,b,g)}throw Error("Invalid arity: "+arguments.length);};f.l=2;f.h=q.h;f.m=e;f.a=d;f.b=c;f.d=q.d;return f}()}}var e=null,f=function(){function a(c,d,e,f,g){var r=null;if(4<arguments.length){for(var r=0,s=Array(arguments.length-4);r<s.length;)s[r]=arguments[r+4],++r;r=new F(s,0)}return b.call(this,c,d,e,f,r)}function b(a,c,d,f,g){var h=function u(a){return new zd(null,function(){var b=e.b(E,a);return Ud(gd,b)?L(e.b(H,
b),u(e.b(I,b))):null},null,null)};return e.b(function(){return function(b){return S.b(a,b)}}(h),h(Gc.d(g,f,N([d,c],0))))}a.l=4;a.h=function(a){var c=H(a);a=J(a);var d=H(a);a=J(a);var e=H(a);a=J(a);var f=H(a);a=I(a);return b(c,d,e,f,a)};a.d=b;return a}(),e=function(e,h,k,m,n){switch(arguments.length){case 1:return d.call(this,e);case 2:return c.call(this,e,h);case 3:return b.call(this,e,h,k);case 4:return a.call(this,e,h,k,m);default:var p=null;if(4<arguments.length){for(var p=0,q=Array(arguments.length-
4);p<q.length;)q[p]=arguments[p+4],++p;p=new F(q,0)}return f.d(e,h,k,m,p)}throw Error("Invalid arity: "+arguments.length);};e.l=4;e.h=f.h;e.a=d;e.b=c;e.c=b;e.i=a;e.d=f.d;return e}(),he=function(){function a(a,b){return new zd(null,function(){if(0<a){var f=E(b);return f?L(H(f),c.b(a-1,I(f))):null}return null},null,null)}function b(a){return function(b){return function(a){return function(){function c(d,g){var h=rb(a),k=a.ad(a.Wa(null)-1),h=0<h?b.b?b.b(d,g):b.call(null,d,g):d;return 0<k?h:xc(h)?h:new wc(h)}
function d(a){return b.a?b.a(a):b.call(null,a)}function k(){return b.m?b.m():b.call(null)}var m=null,m=function(a,b){switch(arguments.length){case 0:return k.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};m.m=k;m.a=d;m.b=c;return m}()}(new fe(a))}}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}(),
ie=function(){function a(a,b){return he.b(a,c.a(b))}function b(a){return new zd(null,function(){return L(a,c.a(a))},null,null)}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}(),je=function(){function a(a,b){return new zd(null,function(){var f=E(b);if(f){if(Wc(f)){for(var g=Rb(f),h=O(g),k=Dd(h),m=0;;)if(m<h){var n;n=C.b(g,m);n=a.a?a.a(n):a.call(null,n);w(n)&&(n=C.b(g,
m),k.add(n));m+=1}else break;return Gd(k.P(),c.b(a,Sb(f)))}g=H(f);f=I(f);return w(a.a?a.a(g):a.call(null,g))?L(g,c.b(a,f)):c.b(a,f)}return null},null,null)}function b(a){return function(b){return function(){function c(f,g){return w(a.a?a.a(g):a.call(null,g))?b.b?b.b(f,g):b.call(null,f,g):f}function g(a){return b.a?b.a(a):b.call(null,a)}function h(){return b.m?b.m():b.call(null)}var k=null,k=function(a,b){switch(arguments.length){case 0:return h.call(this);case 1:return g.call(this,a);case 2:return c.call(this,
a,b)}throw Error("Invalid arity: "+arguments.length);};k.m=h;k.a=g;k.b=c;return k}()}}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}(),ke=function(){function a(a,b){return je.b(Wd(a),b)}function b(a){return je.a(Wd(a))}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);
};c.a=b;c.b=a;return c}(),le=function(){function a(a,b,c){return a&&(a.q&4||a.Nc)?Nc(Od(hd.i(b,Pd,Lb(a),c)),Oc(a)):hd.i(b,Gc,a,c)}function b(a,b){return null!=a?a&&(a.q&4||a.Nc)?Nc(Od(Pa.c(Mb,Lb(a),b)),Oc(a)):Pa.c(Wa,a,b):Pa.c(Gc,nc,b)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}(),me=function(){function a(a,b,c,d){return le.b(Fc,ge.i(a,b,c,d))}function b(a,
b,c){return le.b(Fc,ge.c(a,b,c))}function c(a,b){return Od(Pa.c(function(b,c){return Pd.b(b,a.a?a.a(c):a.call(null,c))},Lb(Fc),b))}var d=null,e=function(){function a(c,d,e,f,p){var q=null;if(4<arguments.length){for(var q=0,r=Array(arguments.length-4);q<r.length;)r[q]=arguments[q+4],++q;q=new F(r,0)}return b.call(this,c,d,e,f,q)}function b(a,c,d,e,f){return le.b(Fc,S.d(ge,a,c,d,e,N([f],0)))}a.l=4;a.h=function(a){var c=H(a);a=J(a);var d=H(a);a=J(a);var e=H(a);a=J(a);var f=H(a);a=I(a);return b(c,d,e,
f,a)};a.d=b;return a}(),d=function(d,g,h,k,m){switch(arguments.length){case 2:return c.call(this,d,g);case 3:return b.call(this,d,g,h);case 4:return a.call(this,d,g,h,k);default:var n=null;if(4<arguments.length){for(var n=0,p=Array(arguments.length-4);n<p.length;)p[n]=arguments[n+4],++n;n=new F(p,0)}return e.d(d,g,h,k,n)}throw Error("Invalid arity: "+arguments.length);};d.l=4;d.h=e.h;d.b=c;d.c=b;d.i=a;d.d=e.d;return d}();
function ne(a,b){return Od(Pa.c(function(b,d){return w(a.a?a.a(d):a.call(null,d))?Pd.b(b,d):b},Lb(Fc),b))}
var oe=function(){function a(a,b,c){var g=$c;for(b=E(b);;)if(b){var h=a;if(h?h.j&256||h.Tb||(h.j?0:y(eb,h)):y(eb,h)){a=R.c(a,H(b),g);if(g===a)return c;b=J(b)}else return c}else return a}function b(a,b){return c.c(a,b,null)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}(),qe=function pe(b,c,d){var e=Q.c(c,0,null);return(c=md(c))?Jc.c(b,e,pe(R.b(b,e),c,d)):Jc.c(b,
e,d)},re=function(){function a(a,b,c,d,f,p){var q=Q.c(b,0,null);return(b=md(b))?Jc.c(a,q,e.t(R.b(a,q),b,c,d,f,p)):Jc.c(a,q,function(){var b=R.b(a,q);return c.i?c.i(b,d,f,p):c.call(null,b,d,f,p)}())}function b(a,b,c,d,f){var p=Q.c(b,0,null);return(b=md(b))?Jc.c(a,p,e.s(R.b(a,p),b,c,d,f)):Jc.c(a,p,function(){var b=R.b(a,p);return c.c?c.c(b,d,f):c.call(null,b,d,f)}())}function c(a,b,c,d){var f=Q.c(b,0,null);return(b=md(b))?Jc.c(a,f,e.i(R.b(a,f),b,c,d)):Jc.c(a,f,function(){var b=R.b(a,f);return c.b?c.b(b,
d):c.call(null,b,d)}())}function d(a,b,c){var d=Q.c(b,0,null);return(b=md(b))?Jc.c(a,d,e.c(R.b(a,d),b,c)):Jc.c(a,d,function(){var b=R.b(a,d);return c.a?c.a(b):c.call(null,b)}())}var e=null,f=function(){function a(c,d,e,f,g,r,s){var u=null;if(6<arguments.length){for(var u=0,x=Array(arguments.length-6);u<x.length;)x[u]=arguments[u+6],++u;u=new F(x,0)}return b.call(this,c,d,e,f,g,r,u)}function b(a,c,d,f,g,h,s){var u=Q.c(c,0,null);return(c=md(c))?Jc.c(a,u,S.d(e,R.b(a,u),c,d,f,N([g,h,s],0))):Jc.c(a,u,
S.d(d,R.b(a,u),f,g,h,N([s],0)))}a.l=6;a.h=function(a){var c=H(a);a=J(a);var d=H(a);a=J(a);var e=H(a);a=J(a);var f=H(a);a=J(a);var g=H(a);a=J(a);var s=H(a);a=I(a);return b(c,d,e,f,g,s,a)};a.d=b;return a}(),e=function(e,h,k,m,n,p,q){switch(arguments.length){case 3:return d.call(this,e,h,k);case 4:return c.call(this,e,h,k,m);case 5:return b.call(this,e,h,k,m,n);case 6:return a.call(this,e,h,k,m,n,p);default:var r=null;if(6<arguments.length){for(var r=0,s=Array(arguments.length-6);r<s.length;)s[r]=arguments[r+
6],++r;r=new F(s,0)}return f.d(e,h,k,m,n,p,r)}throw Error("Invalid arity: "+arguments.length);};e.l=6;e.h=f.h;e.c=d;e.i=c;e.s=b;e.t=a;e.d=f.d;return e}();function se(a,b){this.G=a;this.e=b}function te(a){return new se(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function ue(a){a=a.k;return 32>a?0:a-1>>>5<<5}
function ve(a,b,c){for(;;){if(0===b)return c;var d=te(a);d.e[0]=c;c=d;b-=5}}var xe=function we(b,c,d,e){var f=new se(d.G,Na(d.e)),g=b.k-1>>>c&31;5===c?f.e[g]=e:(d=d.e[g],b=null!=d?we(b,c-5,d,e):ve(null,c-5,e),f.e[g]=b);return f};function ye(a,b){throw Error([B("No item "),B(a),B(" in vector of length "),B(b)].join(""));}function ze(a,b){if(b>=ue(a))return a.B;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.e[b>>>d&31],d=e;else return c.e}function Ie(a,b){return 0<=b&&b<a.k?ze(a,b):ye(b,a.k)}
var Ke=function Je(b,c,d,e,f){var g=new se(d.G,Na(d.e));if(0===c)g.e[e&31]=f;else{var h=e>>>c&31;b=Je(b,c-5,d.e[h],e,f);g.e[h]=b}return g};function Le(a,b,c,d,e,f){this.p=a;this.Eb=b;this.e=c;this.Ka=d;this.start=e;this.end=f}Le.prototype.Ab=function(){return this.p<this.end};Le.prototype.next=function(){32===this.p-this.Eb&&(this.e=ze(this.Ka,this.p),this.Eb+=32);var a=this.e[this.p&31];this.p+=1;return a};
function V(a,b,c,d,e,f){this.o=a;this.k=b;this.shift=c;this.root=d;this.B=e;this.n=f;this.j=167668511;this.q=8196}l=V.prototype;l.toString=function(){return $b(this)};l.J=function(a,b){return fb.c(this,b,null)};l.I=function(a,b,c){return"number"===typeof b?C.c(this,b,c):c};l.v=function(a,b){return Ie(this,b)[b&31]};l.ta=function(a,b,c){return 0<=b&&b<this.k?ze(this,b)[b&31]:c};
l.Mb=function(a,b,c){if(0<=b&&b<this.k)return ue(this)<=b?(a=Na(this.B),a[b&31]=c,new V(this.o,this.k,this.shift,this.root,a,null)):new V(this.o,this.k,this.shift,Ke(this,this.shift,this.root,b,c),this.B,null);if(b===this.k)return Wa(this,c);throw Error([B("Index "),B(b),B(" out of bounds  [0,"),B(this.k),B("]")].join(""));};l.gb=function(){var a=this.k;return new Le(0,0,0<O(this)?ze(this,0):null,this,0,a)};l.A=function(){return this.o};l.O=function(){return this.k};
l.Kb=function(){return C.b(this,0)};l.Lb=function(){return C.b(this,1)};l.D=function(){var a=this.n;return null!=a?a:this.n=a=sc(this)};l.C=function(a,b){if(b instanceof V)if(this.k===O(b))for(var c=Yb(this),d=Yb(b);;)if(w(c.Ab())){var e=c.next(),f=d.next();if(!oc.b(e,f))return!1}else return!0;else return!1;else return Dc(this,b)};
l.Xa=function(){var a=this;return new Me(a.k,a.shift,function(){var b=a.root;return Ne.a?Ne.a(b):Ne.call(null,b)}(),function(){var b=a.B;return Oe.a?Oe.a(b):Oe.call(null,b)}())};l.U=function(){return Nc(Fc,this.o)};l.ja=function(a,b){return yc.b(this,b)};
l.ka=function(a,b,c){a=0;for(var d=c;;)if(a<this.k){var e=ze(this,a);c=e.length;a:{for(var f=0;;)if(f<c){var g=e[f],d=b.b?b.b(d,g):b.call(null,d,g);if(xc(d)){e=d;break a}f+=1}else{e=d;break a}e=void 0}if(xc(e))return b=e,K.a?K.a(b):K.call(null,b);a+=c;d=e}else return d};l.Ea=function(a,b,c){if("number"===typeof b)return qb(this,b,c);throw Error("Vector's key for assoc must be a number.");};
l.M=function(){if(0===this.k)return null;if(32>=this.k)return new F(this.B,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.e[0];else{a=a.e;break a}a=void 0}return Pe.i?Pe.i(this,a,0,0):Pe.call(null,this,a,0,0)};l.F=function(a,b){return new V(b,this.k,this.shift,this.root,this.B,this.n)};
l.N=function(a,b){if(32>this.k-ue(this)){for(var c=this.B.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.B[e],e+=1;else break;d[c]=b;return new V(this.o,this.k+1,this.shift,this.root,d,null)}c=(d=this.k>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=te(null),d.e[0]=this.root,e=ve(null,this.shift,new se(null,this.B)),d.e[1]=e):d=xe(this,this.shift,this.root,new se(null,this.B));return new V(this.o,this.k+1,c,d,[b],null)};
l.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.v(null,c);case 3:return this.ta(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.v(null,c)};a.c=function(a,c,d){return this.ta(null,c,d)};return a}();l.apply=function(a,b){return this.call.apply(this,[this].concat(Na(b)))};l.a=function(a){return this.v(null,a)};l.b=function(a,b){return this.ta(null,a,b)};
var X=new se(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),Fc=new V(null,0,5,X,[],tc);V.prototype[Ma]=function(){return qc(this)};
function Qe(a){if(a instanceof Array)a:{var b=a.length;if(32>b)a=new V(null,b,5,X,a,null);else{for(var c=32,d=(new V(null,32,5,X,a.slice(0,32),null)).Xa(null);;)if(c<b)var e=c+1,d=Pd.b(d,a[c]),c=e;else{a=Nb(d);break a}a=void 0}}else a=Nb(Pa.c(Mb,Lb(Fc),a));return a}function Re(a,b,c,d,e,f){this.xa=a;this.Ha=b;this.p=c;this.ha=d;this.o=e;this.n=f;this.j=32375020;this.q=1536}l=Re.prototype;l.toString=function(){return $b(this)};l.A=function(){return this.o};
l.la=function(){if(this.ha+1<this.Ha.length){var a;a=this.xa;var b=this.Ha,c=this.p,d=this.ha+1;a=Pe.i?Pe.i(a,b,c,d):Pe.call(null,a,b,c,d);return null==a?null:a}return Tb(this)};l.D=function(){var a=this.n;return null!=a?a:this.n=a=sc(this)};l.C=function(a,b){return Dc(this,b)};l.U=function(){return Nc(Fc,this.o)};l.ja=function(a,b){var c=this;return yc.b(function(){var a=c.xa,b=c.p+c.ha,f=O(c.xa);return Se.c?Se.c(a,b,f):Se.call(null,a,b,f)}(),b)};
l.ka=function(a,b,c){var d=this;return yc.c(function(){var a=d.xa,b=d.p+d.ha,c=O(d.xa);return Se.c?Se.c(a,b,c):Se.call(null,a,b,c)}(),b,c)};l.ga=function(){return this.Ha[this.ha]};l.sa=function(){if(this.ha+1<this.Ha.length){var a;a=this.xa;var b=this.Ha,c=this.p,d=this.ha+1;a=Pe.i?Pe.i(a,b,c,d):Pe.call(null,a,b,c,d);return null==a?nc:a}return Sb(this)};l.M=function(){return this};l.Hb=function(){return Ed.b(this.Ha,this.ha)};
l.Ib=function(){var a=this.p+this.Ha.length;if(a<Ta(this.xa)){var b=this.xa,c=ze(this.xa,a);return Pe.i?Pe.i(b,c,a,0):Pe.call(null,b,c,a,0)}return nc};l.F=function(a,b){var c=this.xa,d=this.Ha,e=this.p,f=this.ha;return Pe.s?Pe.s(c,d,e,f,b):Pe.call(null,c,d,e,f,b)};l.N=function(a,b){return L(b,this)};l.Gb=function(){var a=this.p+this.Ha.length;if(a<Ta(this.xa)){var b=this.xa,c=ze(this.xa,a);return Pe.i?Pe.i(b,c,a,0):Pe.call(null,b,c,a,0)}return null};Re.prototype[Ma]=function(){return qc(this)};
var Pe=function(){function a(a,b,c,d,k){return new Re(a,b,c,d,k,null)}function b(a,b,c,d){return new Re(a,b,c,d,null,null)}function c(a,b,c){return new Re(a,Ie(a,b),b,c,null,null)}var d=null,d=function(d,f,g,h,k){switch(arguments.length){case 3:return c.call(this,d,f,g);case 4:return b.call(this,d,f,g,h);case 5:return a.call(this,d,f,g,h,k)}throw Error("Invalid arity: "+arguments.length);};d.c=c;d.i=b;d.s=a;return d}();
function Te(a,b,c,d,e){this.o=a;this.Ka=b;this.start=c;this.end=d;this.n=e;this.j=166617887;this.q=8192}l=Te.prototype;l.toString=function(){return $b(this)};l.J=function(a,b){return fb.c(this,b,null)};l.I=function(a,b,c){return"number"===typeof b?C.c(this,b,c):c};l.v=function(a,b){return 0>b||this.end<=this.start+b?ye(b,this.end-this.start):C.b(this.Ka,this.start+b)};l.ta=function(a,b,c){return 0>b||this.end<=this.start+b?c:C.c(this.Ka,this.start+b,c)};
l.Mb=function(a,b,c){var d=this.start+b;a=this.o;c=Jc.c(this.Ka,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return Ue.s?Ue.s(a,c,b,d,null):Ue.call(null,a,c,b,d,null)};l.A=function(){return this.o};l.O=function(){return this.end-this.start};l.D=function(){var a=this.n;return null!=a?a:this.n=a=sc(this)};l.C=function(a,b){return Dc(this,b)};l.U=function(){return Nc(Fc,this.o)};l.ja=function(a,b){return yc.b(this,b)};l.ka=function(a,b,c){return yc.c(this,b,c)};
l.Ea=function(a,b,c){if("number"===typeof b)return qb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};l.M=function(){var a=this;return function(b){return function d(e){return e===a.end?null:L(C.b(a.Ka,e),new zd(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};l.F=function(a,b){var c=this.Ka,d=this.start,e=this.end,f=this.n;return Ue.s?Ue.s(b,c,d,e,f):Ue.call(null,b,c,d,e,f)};
l.N=function(a,b){var c=this.o,d=qb(this.Ka,this.end,b),e=this.start,f=this.end+1;return Ue.s?Ue.s(c,d,e,f,null):Ue.call(null,c,d,e,f,null)};l.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.v(null,c);case 3:return this.ta(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.v(null,c)};a.c=function(a,c,d){return this.ta(null,c,d)};return a}();l.apply=function(a,b){return this.call.apply(this,[this].concat(Na(b)))};
l.a=function(a){return this.v(null,a)};l.b=function(a,b){return this.ta(null,a,b)};Te.prototype[Ma]=function(){return qc(this)};function Ue(a,b,c,d,e){for(;;)if(b instanceof Te)c=b.start+c,d=b.start+d,b=b.Ka;else{var f=O(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new Te(a,b,c,d,e)}}
var Se=function(){function a(a,b,c){return Ue(null,a,b,c,null)}function b(a,b){return c.c(a,b,O(a))}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();function Ve(a,b){return a===b.G?b:new se(a,Na(b.e))}function Ne(a){return new se({},Na(a.e))}
function Oe(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];Yc(a,0,b,0,a.length);return b}var Xe=function We(b,c,d,e){d=Ve(b.root.G,d);var f=b.k-1>>>c&31;if(5===c)b=e;else{var g=d.e[f];b=null!=g?We(b,c-5,g,e):ve(b.root.G,c-5,e)}d.e[f]=b;return d};function Me(a,b,c,d){this.k=a;this.shift=b;this.root=c;this.B=d;this.j=275;this.q=88}l=Me.prototype;
l.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();l.apply=function(a,b){return this.call.apply(this,[this].concat(Na(b)))};l.a=function(a){return this.J(null,a)};l.b=function(a,b){return this.I(null,a,b)};l.J=function(a,b){return fb.c(this,b,null)};
l.I=function(a,b,c){return"number"===typeof b?C.c(this,b,c):c};l.v=function(a,b){if(this.root.G)return Ie(this,b)[b&31];throw Error("nth after persistent!");};l.ta=function(a,b,c){return 0<=b&&b<this.k?C.b(this,b):c};l.O=function(){if(this.root.G)return this.k;throw Error("count after persistent!");};
l.Vb=function(a,b,c){var d=this;if(d.root.G){if(0<=b&&b<d.k)return ue(this)<=b?d.B[b&31]=c:(a=function(){return function f(a,h){var k=Ve(d.root.G,h);if(0===a)k.e[b&31]=c;else{var m=b>>>a&31,n=f(a-5,k.e[m]);k.e[m]=n}return k}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.k)return Mb(this,c);throw Error([B("Index "),B(b),B(" out of bounds for TransientVector of length"),B(d.k)].join(""));}throw Error("assoc! after persistent!");};
l.kb=function(a,b,c){if("number"===typeof b)return Pb(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
l.Qa=function(a,b){if(this.root.G){if(32>this.k-ue(this))this.B[this.k&31]=b;else{var c=new se(this.root.G,this.B),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.B=d;if(this.k>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=ve(this.root.G,this.shift,c);this.root=new se(this.root.G,d);this.shift=e}else this.root=Xe(this,this.shift,this.root,c)}this.k+=1;return this}throw Error("conj! after persistent!");};l.Ra=function(){if(this.root.G){this.root.G=null;var a=this.k-ue(this),b=Array(a);Yc(this.B,0,b,0,a);return new V(null,this.k,this.shift,this.root,b,null)}throw Error("persistent! called twice");};function Ye(){this.q=0;this.j=2097152}Ye.prototype.C=function(){return!1};var Ze=new Ye;
function $e(a,b){return bd(Uc(b)?O(a)===O(b)?Ud(gd,ge.b(function(a){return oc.b(R.c(b,H(a),Ze),H(J(a)))},a)):null:null)}
function af(a,b){var c=a.e;if(b instanceof T)a:{for(var d=c.length,e=b.qa,f=0;;){if(d<=f){c=-1;break a}var g=c[f];if(g instanceof T&&e===g.qa){c=f;break a}f+=2}c=void 0}else if(d="string"==typeof b,w(w(d)?d:"number"===typeof b))a:{d=c.length;for(e=0;;){if(d<=e){c=-1;break a}if(b===c[e]){c=e;break a}e+=2}c=void 0}else if(b instanceof lc)a:{d=c.length;e=b.str;for(f=0;;){if(d<=f){c=-1;break a}g=c[f];if(g instanceof lc&&e===g.str){c=f;break a}f+=2}c=void 0}else if(null==b)a:{d=c.length;for(e=0;;){if(d<=
e){c=-1;break a}if(null==c[e]){c=e;break a}e+=2}c=void 0}else a:{d=c.length;for(e=0;;){if(d<=e){c=-1;break a}if(oc.b(b,c[e])){c=e;break a}e+=2}c=void 0}return c}function bf(a,b,c){this.e=a;this.p=b;this.oa=c;this.q=0;this.j=32374990}l=bf.prototype;l.toString=function(){return $b(this)};l.A=function(){return this.oa};l.la=function(){return this.p<this.e.length-2?new bf(this.e,this.p+2,this.oa):null};l.O=function(){return(this.e.length-this.p)/2};l.D=function(){return sc(this)};
l.C=function(a,b){return Dc(this,b)};l.U=function(){return Nc(nc,this.oa)};l.ja=function(a,b){return fd.b(b,this)};l.ka=function(a,b,c){return fd.c(b,c,this)};l.ga=function(){return new V(null,2,5,X,[this.e[this.p],this.e[this.p+1]],null)};l.sa=function(){return this.p<this.e.length-2?new bf(this.e,this.p+2,this.oa):nc};l.M=function(){return this};l.F=function(a,b){return new bf(this.e,this.p,b)};l.N=function(a,b){return L(b,this)};bf.prototype[Ma]=function(){return qc(this)};
function cf(a,b,c){this.e=a;this.p=b;this.k=c}cf.prototype.Ab=function(){return this.p<this.k};cf.prototype.next=function(){var a=new V(null,2,5,X,[this.e[this.p],this.e[this.p+1]],null);this.p+=2;return a};function v(a,b,c,d){this.o=a;this.k=b;this.e=c;this.n=d;this.j=16647951;this.q=8196}l=v.prototype;l.toString=function(){return $b(this)};l.keys=function(){return qc(df.a?df.a(this):df.call(null,this))};l.J=function(a,b){return fb.c(this,b,null)};
l.I=function(a,b,c){a=af(this,b);return-1===a?c:this.e[a+1]};l.gb=function(){return new cf(this.e,0,2*this.k)};l.A=function(){return this.o};l.O=function(){return this.k};l.D=function(){var a=this.n;return null!=a?a:this.n=a=uc(this)};l.C=function(a,b){if(b&&(b.j&1024||b.Rc)){var c=this.e.length;if(this.k===b.O(null))for(var d=0;;)if(d<c){var e=b.I(null,this.e[d],$c);if(e!==$c)if(oc.b(this.e[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return $e(this,b)};
l.Xa=function(){return new ef({},this.e.length,Na(this.e))};l.U=function(){return wb(Y,this.o)};l.ja=function(a,b){return fd.b(b,this)};l.ka=function(a,b,c){return fd.c(b,c,this)};l.La=function(a,b){if(0<=af(this,b)){var c=this.e.length,d=c-2;if(0===d)return Ua(this);for(var d=Array(d),e=0,f=0;;){if(e>=c)return new v(this.o,this.k-1,d,null);oc.b(b,this.e[e])||(d[f]=this.e[e],d[f+1]=this.e[e+1],f+=2);e+=2}}else return this};
l.Ea=function(a,b,c){a=af(this,b);if(-1===a){if(this.k<ff){a=this.e;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new v(this.o,this.k+1,e,null)}return wb(hb(le.b(gf,this),b,c),this.o)}if(c===this.e[a+1])return this;b=Na(this.e);b[a+1]=c;return new v(this.o,this.k,b,null)};l.Fb=function(a,b){return-1!==af(this,b)};l.M=function(){var a=this.e;return 0<=a.length-2?new bf(a,0,null):null};l.F=function(a,b){return new v(b,this.k,this.e,this.n)};
l.N=function(a,b){if(Vc(b))return hb(this,C.b(b,0),C.b(b,1));for(var c=this,d=E(b);;){if(null==d)return c;var e=H(d);if(Vc(e))c=hb(c,C.b(e,0),C.b(e,1)),d=J(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
l.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();l.apply=function(a,b){return this.call.apply(this,[this].concat(Na(b)))};l.a=function(a){return this.J(null,a)};l.b=function(a,b){return this.I(null,a,b)};var Y=new v(null,0,[],vc),ff=8;
function hf(a){for(var b=a.length,c=0,d=Lb(Y);;)if(c<b)var e=c+2,d=Ob(d,a[c],a[c+1]),c=e;else return Nb(d)}v.prototype[Ma]=function(){return qc(this)};function ef(a,b,c){this.$a=a;this.len=b;this.e=c;this.q=56;this.j=258}l=ef.prototype;
l.kb=function(a,b,c){var d=this;if(w(d.$a)){a=af(this,b);if(-1===a)return d.len+2<=2*ff?(d.len+=2,d.e.push(b),d.e.push(c),this):Qd.c(function(){var a=d.len,b=d.e;return jf.b?jf.b(a,b):jf.call(null,a,b)}(),b,c);c!==d.e[a+1]&&(d.e[a+1]=c);return this}throw Error("assoc! after persistent!");};
l.Qa=function(a,b){if(w(this.$a)){if(b?b.j&2048||b.Sc||(b.j?0:y(kb,b)):y(kb,b))return Ob(this,od.a?od.a(b):od.call(null,b),pd.a?pd.a(b):pd.call(null,b));for(var c=E(b),d=this;;){var e=H(c);if(w(e))var f=e,c=J(c),d=Ob(d,function(){var a=f;return od.a?od.a(a):od.call(null,a)}(),function(){var a=f;return pd.a?pd.a(a):pd.call(null,a)}());else return d}}else throw Error("conj! after persistent!");};
l.Ra=function(){if(w(this.$a))return this.$a=!1,new v(null,kd(this.len,2),this.e,null);throw Error("persistent! called twice");};l.J=function(a,b){return fb.c(this,b,null)};l.I=function(a,b,c){if(w(this.$a))return a=af(this,b),-1===a?c:this.e[a+1];throw Error("lookup after persistent!");};l.O=function(){if(w(this.$a))return kd(this.len,2);throw Error("count after persistent!");};function jf(a,b){for(var c=Lb(gf),d=0;;)if(d<a)c=Qd.c(c,b[d],b[d+1]),d+=2;else return c}function kf(){this.T=!1}
function lf(a,b){return a===b?!0:vd(a,b)?!0:oc.b(a,b)}var mf=function(){function a(a,b,c,g,h){a=Na(a);a[b]=c;a[g]=h;return a}function b(a,b,c){a=Na(a);a[b]=c;return a}var c=null,c=function(c,e,f,g,h){switch(arguments.length){case 3:return b.call(this,c,e,f);case 5:return a.call(this,c,e,f,g,h)}throw Error("Invalid arity: "+arguments.length);};c.c=b;c.s=a;return c}();function nf(a,b){var c=Array(a.length-2);Yc(a,0,c,0,2*b);Yc(a,2*(b+1),c,2*b,c.length-2*b);return c}
var of=function(){function a(a,b,c,g,h,k){a=a.ab(b);a.e[c]=g;a.e[h]=k;return a}function b(a,b,c,g){a=a.ab(b);a.e[c]=g;return a}var c=null,c=function(c,e,f,g,h,k){switch(arguments.length){case 4:return b.call(this,c,e,f,g);case 6:return a.call(this,c,e,f,g,h,k)}throw Error("Invalid arity: "+arguments.length);};c.i=b;c.t=a;return c}();function pf(a,b,c){this.G=a;this.L=b;this.e=c}l=pf.prototype;
l.ab=function(a){if(a===this.G)return this;var b=ld(this.L),c=Array(0>b?4:2*(b+1));Yc(this.e,0,c,0,2*b);return new pf(a,this.L,c)};l.ob=function(){var a=this.e;return qf.a?qf.a(a):qf.call(null,a)};l.Ma=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.L&e))return d;var f=ld(this.L&e-1),e=this.e[2*f],f=this.e[2*f+1];return null==e?f.Ma(a+5,b,c,d):lf(c,e)?f:d};
l.Ca=function(a,b,c,d,e,f){var g=1<<(c>>>b&31),h=ld(this.L&g-1);if(0===(this.L&g)){var k=ld(this.L);if(2*k<this.e.length){var m=this.ab(a),n=m.e;f.T=!0;Zc(n,2*h,n,2*(h+1),2*(k-h));n[2*h]=d;n[2*h+1]=e;m.L|=g;return m}if(16<=k){g=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];g[c>>>b&31]=rf.Ca(a,b+5,c,d,e,f);for(m=h=0;;)if(32>h)0!==(this.L>>>h&1)&&(g[h]=null!=this.e[m]?rf.Ca(a,b+5,ic(this.e[m]),
this.e[m],this.e[m+1],f):this.e[m+1],m+=2),h+=1;else break;return new sf(a,k+1,g)}n=Array(2*(k+4));Yc(this.e,0,n,0,2*h);n[2*h]=d;n[2*h+1]=e;Yc(this.e,2*h,n,2*(h+1),2*(k-h));f.T=!0;m=this.ab(a);m.e=n;m.L|=g;return m}var p=this.e[2*h],q=this.e[2*h+1];if(null==p)return k=q.Ca(a,b+5,c,d,e,f),k===q?this:of.i(this,a,2*h+1,k);if(lf(d,p))return e===q?this:of.i(this,a,2*h+1,e);f.T=!0;return of.t(this,a,2*h,null,2*h+1,function(){var f=b+5;return tf.Q?tf.Q(a,f,p,q,c,d,e):tf.call(null,a,f,p,q,c,d,e)}())};
l.Ba=function(a,b,c,d,e){var f=1<<(b>>>a&31),g=ld(this.L&f-1);if(0===(this.L&f)){var h=ld(this.L);if(16<=h){f=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];f[b>>>a&31]=rf.Ba(a+5,b,c,d,e);for(var k=g=0;;)if(32>g)0!==(this.L>>>g&1)&&(f[g]=null!=this.e[k]?rf.Ba(a+5,ic(this.e[k]),this.e[k],this.e[k+1],e):this.e[k+1],k+=2),g+=1;else break;return new sf(null,h+1,f)}k=Array(2*(h+1));Yc(this.e,
0,k,0,2*g);k[2*g]=c;k[2*g+1]=d;Yc(this.e,2*g,k,2*(g+1),2*(h-g));e.T=!0;return new pf(null,this.L|f,k)}var m=this.e[2*g],n=this.e[2*g+1];if(null==m)return h=n.Ba(a+5,b,c,d,e),h===n?this:new pf(null,this.L,mf.c(this.e,2*g+1,h));if(lf(c,m))return d===n?this:new pf(null,this.L,mf.c(this.e,2*g+1,d));e.T=!0;return new pf(null,this.L,mf.s(this.e,2*g,null,2*g+1,function(){var e=a+5;return tf.t?tf.t(e,m,n,b,c,d):tf.call(null,e,m,n,b,c,d)}()))};
l.pb=function(a,b,c){var d=1<<(b>>>a&31);if(0===(this.L&d))return this;var e=ld(this.L&d-1),f=this.e[2*e],g=this.e[2*e+1];return null==f?(a=g.pb(a+5,b,c),a===g?this:null!=a?new pf(null,this.L,mf.c(this.e,2*e+1,a)):this.L===d?null:new pf(null,this.L^d,nf(this.e,e))):lf(c,f)?new pf(null,this.L^d,nf(this.e,e)):this};var rf=new pf(null,0,[]);function sf(a,b,c){this.G=a;this.k=b;this.e=c}l=sf.prototype;l.ab=function(a){return a===this.G?this:new sf(a,this.k,Na(this.e))};
l.ob=function(){var a=this.e;return uf.a?uf.a(a):uf.call(null,a)};l.Ma=function(a,b,c,d){var e=this.e[b>>>a&31];return null!=e?e.Ma(a+5,b,c,d):d};l.Ca=function(a,b,c,d,e,f){var g=c>>>b&31,h=this.e[g];if(null==h)return a=of.i(this,a,g,rf.Ca(a,b+5,c,d,e,f)),a.k+=1,a;b=h.Ca(a,b+5,c,d,e,f);return b===h?this:of.i(this,a,g,b)};
l.Ba=function(a,b,c,d,e){var f=b>>>a&31,g=this.e[f];if(null==g)return new sf(null,this.k+1,mf.c(this.e,f,rf.Ba(a+5,b,c,d,e)));a=g.Ba(a+5,b,c,d,e);return a===g?this:new sf(null,this.k,mf.c(this.e,f,a))};
l.pb=function(a,b,c){var d=b>>>a&31,e=this.e[d];if(null!=e){a=e.pb(a+5,b,c);if(a===e)d=this;else if(null==a)if(8>=this.k)a:{e=this.e;a=e.length;b=Array(2*(this.k-1));c=0;for(var f=1,g=0;;)if(c<a)c!==d&&null!=e[c]&&(b[f]=e[c],f+=2,g|=1<<c),c+=1;else{d=new pf(null,g,b);break a}d=void 0}else d=new sf(null,this.k-1,mf.c(this.e,d,a));else d=new sf(null,this.k,mf.c(this.e,d,a));return d}return this};function vf(a,b,c){b*=2;for(var d=0;;)if(d<b){if(lf(c,a[d]))return d;d+=2}else return-1}
function wf(a,b,c,d){this.G=a;this.Ga=b;this.k=c;this.e=d}l=wf.prototype;l.ab=function(a){if(a===this.G)return this;var b=Array(2*(this.k+1));Yc(this.e,0,b,0,2*this.k);return new wf(a,this.Ga,this.k,b)};l.ob=function(){var a=this.e;return qf.a?qf.a(a):qf.call(null,a)};l.Ma=function(a,b,c,d){a=vf(this.e,this.k,c);return 0>a?d:lf(c,this.e[a])?this.e[a+1]:d};
l.Ca=function(a,b,c,d,e,f){if(c===this.Ga){b=vf(this.e,this.k,d);if(-1===b){if(this.e.length>2*this.k)return a=of.t(this,a,2*this.k,d,2*this.k+1,e),f.T=!0,a.k+=1,a;c=this.e.length;b=Array(c+2);Yc(this.e,0,b,0,c);b[c]=d;b[c+1]=e;f.T=!0;f=this.k+1;a===this.G?(this.e=b,this.k=f,a=this):a=new wf(this.G,this.Ga,f,b);return a}return this.e[b+1]===e?this:of.i(this,a,b+1,e)}return(new pf(a,1<<(this.Ga>>>b&31),[null,this,null,null])).Ca(a,b,c,d,e,f)};
l.Ba=function(a,b,c,d,e){return b===this.Ga?(a=vf(this.e,this.k,c),-1===a?(a=2*this.k,b=Array(a+2),Yc(this.e,0,b,0,a),b[a]=c,b[a+1]=d,e.T=!0,new wf(null,this.Ga,this.k+1,b)):oc.b(this.e[a],d)?this:new wf(null,this.Ga,this.k,mf.c(this.e,a+1,d))):(new pf(null,1<<(this.Ga>>>a&31),[null,this])).Ba(a,b,c,d,e)};l.pb=function(a,b,c){a=vf(this.e,this.k,c);return-1===a?this:1===this.k?null:new wf(null,this.Ga,this.k-1,nf(this.e,kd(a,2)))};
var tf=function(){function a(a,b,c,g,h,k,m){var n=ic(c);if(n===h)return new wf(null,n,2,[c,g,k,m]);var p=new kf;return rf.Ca(a,b,n,c,g,p).Ca(a,b,h,k,m,p)}function b(a,b,c,g,h,k){var m=ic(b);if(m===g)return new wf(null,m,2,[b,c,h,k]);var n=new kf;return rf.Ba(a,m,b,c,n).Ba(a,g,h,k,n)}var c=null,c=function(c,e,f,g,h,k,m){switch(arguments.length){case 6:return b.call(this,c,e,f,g,h,k);case 7:return a.call(this,c,e,f,g,h,k,m)}throw Error("Invalid arity: "+arguments.length);};c.t=b;c.Q=a;return c}();
function xf(a,b,c,d,e){this.o=a;this.Na=b;this.p=c;this.K=d;this.n=e;this.q=0;this.j=32374860}l=xf.prototype;l.toString=function(){return $b(this)};l.A=function(){return this.o};l.D=function(){var a=this.n;return null!=a?a:this.n=a=sc(this)};l.C=function(a,b){return Dc(this,b)};l.U=function(){return Nc(nc,this.o)};l.ja=function(a,b){return fd.b(b,this)};l.ka=function(a,b,c){return fd.c(b,c,this)};l.ga=function(){return null==this.K?new V(null,2,5,X,[this.Na[this.p],this.Na[this.p+1]],null):H(this.K)};
l.sa=function(){if(null==this.K){var a=this.Na,b=this.p+2;return qf.c?qf.c(a,b,null):qf.call(null,a,b,null)}var a=this.Na,b=this.p,c=J(this.K);return qf.c?qf.c(a,b,c):qf.call(null,a,b,c)};l.M=function(){return this};l.F=function(a,b){return new xf(b,this.Na,this.p,this.K,this.n)};l.N=function(a,b){return L(b,this)};xf.prototype[Ma]=function(){return qc(this)};
var qf=function(){function a(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new xf(null,a,b,null,null);var g=a[b+1];if(w(g)&&(g=g.ob(),w(g)))return new xf(null,a,b+2,g,null);b+=2}else return null;else return new xf(null,a,b,c,null)}function b(a){return c.c(a,0,null)}var c=null,c=function(c,e,f){switch(arguments.length){case 1:return b.call(this,c);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();
function yf(a,b,c,d,e){this.o=a;this.Na=b;this.p=c;this.K=d;this.n=e;this.q=0;this.j=32374860}l=yf.prototype;l.toString=function(){return $b(this)};l.A=function(){return this.o};l.D=function(){var a=this.n;return null!=a?a:this.n=a=sc(this)};l.C=function(a,b){return Dc(this,b)};l.U=function(){return Nc(nc,this.o)};l.ja=function(a,b){return fd.b(b,this)};l.ka=function(a,b,c){return fd.c(b,c,this)};l.ga=function(){return H(this.K)};
l.sa=function(){var a=this.Na,b=this.p,c=J(this.K);return uf.i?uf.i(null,a,b,c):uf.call(null,null,a,b,c)};l.M=function(){return this};l.F=function(a,b){return new yf(b,this.Na,this.p,this.K,this.n)};l.N=function(a,b){return L(b,this)};yf.prototype[Ma]=function(){return qc(this)};
var uf=function(){function a(a,b,c,g){if(null==g)for(g=b.length;;)if(c<g){var h=b[c];if(w(h)&&(h=h.ob(),w(h)))return new yf(a,b,c+1,h,null);c+=1}else return null;else return new yf(a,b,c,g,null)}function b(a){return c.i(null,a,0,null)}var c=null,c=function(c,e,f,g){switch(arguments.length){case 1:return b.call(this,c);case 4:return a.call(this,c,e,f,g)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.i=a;return c}();
function zf(a,b,c,d,e,f){this.o=a;this.k=b;this.root=c;this.ra=d;this.wa=e;this.n=f;this.j=16123663;this.q=8196}l=zf.prototype;l.toString=function(){return $b(this)};l.keys=function(){return qc(df.a?df.a(this):df.call(null,this))};l.J=function(a,b){return fb.c(this,b,null)};l.I=function(a,b,c){return null==b?this.ra?this.wa:c:null==this.root?c:this.root.Ma(0,ic(b),b,c)};l.A=function(){return this.o};l.O=function(){return this.k};l.D=function(){var a=this.n;return null!=a?a:this.n=a=uc(this)};
l.C=function(a,b){return $e(this,b)};l.Xa=function(){return new Af({},this.root,this.k,this.ra,this.wa)};l.U=function(){return wb(gf,this.o)};l.La=function(a,b){if(null==b)return this.ra?new zf(this.o,this.k-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.pb(0,ic(b),b);return c===this.root?this:new zf(this.o,this.k-1,c,this.ra,this.wa,null)};
l.Ea=function(a,b,c){if(null==b)return this.ra&&c===this.wa?this:new zf(this.o,this.ra?this.k:this.k+1,this.root,!0,c,null);a=new kf;b=(null==this.root?rf:this.root).Ba(0,ic(b),b,c,a);return b===this.root?this:new zf(this.o,a.T?this.k+1:this.k,b,this.ra,this.wa,null)};l.Fb=function(a,b){return null==b?this.ra:null==this.root?!1:this.root.Ma(0,ic(b),b,$c)!==$c};l.M=function(){if(0<this.k){var a=null!=this.root?this.root.ob():null;return this.ra?L(new V(null,2,5,X,[null,this.wa],null),a):a}return null};
l.F=function(a,b){return new zf(b,this.k,this.root,this.ra,this.wa,this.n)};l.N=function(a,b){if(Vc(b))return hb(this,C.b(b,0),C.b(b,1));for(var c=this,d=E(b);;){if(null==d)return c;var e=H(d);if(Vc(e))c=hb(c,C.b(e,0),C.b(e,1)),d=J(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
l.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();l.apply=function(a,b){return this.call.apply(this,[this].concat(Na(b)))};l.a=function(a){return this.J(null,a)};l.b=function(a,b){return this.I(null,a,b)};var gf=new zf(null,0,null,!1,null,vc);
function Ic(a,b){for(var c=a.length,d=0,e=Lb(gf);;)if(d<c)var f=d+1,e=e.kb(null,a[d],b[d]),d=f;else return Nb(e)}zf.prototype[Ma]=function(){return qc(this)};function Af(a,b,c,d,e){this.G=a;this.root=b;this.count=c;this.ra=d;this.wa=e;this.q=56;this.j=258}l=Af.prototype;l.kb=function(a,b,c){return Bf(this,b,c)};l.Qa=function(a,b){return Cf(this,b)};l.Ra=function(){var a;if(this.G)this.G=null,a=new zf(null,this.count,this.root,this.ra,this.wa,null);else throw Error("persistent! called twice");return a};
l.J=function(a,b){return null==b?this.ra?this.wa:null:null==this.root?null:this.root.Ma(0,ic(b),b)};l.I=function(a,b,c){return null==b?this.ra?this.wa:c:null==this.root?c:this.root.Ma(0,ic(b),b,c)};l.O=function(){if(this.G)return this.count;throw Error("count after persistent!");};
function Cf(a,b){if(a.G){if(b?b.j&2048||b.Sc||(b.j?0:y(kb,b)):y(kb,b))return Bf(a,od.a?od.a(b):od.call(null,b),pd.a?pd.a(b):pd.call(null,b));for(var c=E(b),d=a;;){var e=H(c);if(w(e))var f=e,c=J(c),d=Bf(d,function(){var a=f;return od.a?od.a(a):od.call(null,a)}(),function(){var a=f;return pd.a?pd.a(a):pd.call(null,a)}());else return d}}else throw Error("conj! after persistent");}
function Bf(a,b,c){if(a.G){if(null==b)a.wa!==c&&(a.wa=c),a.ra||(a.count+=1,a.ra=!0);else{var d=new kf;b=(null==a.root?rf:a.root).Ca(a.G,0,ic(b),b,c,d);b!==a.root&&(a.root=b);d.T&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}
var $d=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new F(e,0)}return b.call(this,d)}function b(a){a=E(a);for(var b=Lb(gf);;)if(a){var e=J(J(a)),b=Qd.c(b,H(a),H(J(a)));a=e}else return Nb(b)}a.l=0;a.h=function(a){a=E(a);return b(a)};a.d=b;return a}(),Df=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new F(e,0)}return b.call(this,
d)}function b(a){return hf(S.b(Oa,a))}a.l=0;a.h=function(a){a=E(a);return b(a)};a.d=b;return a}();function Ef(a,b){this.ma=a;this.oa=b;this.q=0;this.j=32374988}l=Ef.prototype;l.toString=function(){return $b(this)};l.A=function(){return this.oa};l.la=function(){var a=this.ma,a=(a?a.j&128||a.ub||(a.j?0:y(cb,a)):y(cb,a))?this.ma.la(null):J(this.ma);return null==a?null:new Ef(a,this.oa)};l.D=function(){return sc(this)};l.C=function(a,b){return Dc(this,b)};l.U=function(){return Nc(nc,this.oa)};
l.ja=function(a,b){return fd.b(b,this)};l.ka=function(a,b,c){return fd.c(b,c,this)};l.ga=function(){return this.ma.ga(null).Kb()};l.sa=function(){var a=this.ma,a=(a?a.j&128||a.ub||(a.j?0:y(cb,a)):y(cb,a))?this.ma.la(null):J(this.ma);return null!=a?new Ef(a,this.oa):nc};l.M=function(){return this};l.F=function(a,b){return new Ef(this.ma,b)};l.N=function(a,b){return L(b,this)};Ef.prototype[Ma]=function(){return qc(this)};function df(a){return(a=E(a))?new Ef(a,null):null}
function od(a){return lb(a)}function Ff(a,b){this.ma=a;this.oa=b;this.q=0;this.j=32374988}l=Ff.prototype;l.toString=function(){return $b(this)};l.A=function(){return this.oa};l.la=function(){var a=this.ma,a=(a?a.j&128||a.ub||(a.j?0:y(cb,a)):y(cb,a))?this.ma.la(null):J(this.ma);return null==a?null:new Ff(a,this.oa)};l.D=function(){return sc(this)};l.C=function(a,b){return Dc(this,b)};l.U=function(){return Nc(nc,this.oa)};l.ja=function(a,b){return fd.b(b,this)};
l.ka=function(a,b,c){return fd.c(b,c,this)};l.ga=function(){return this.ma.ga(null).Lb()};l.sa=function(){var a=this.ma,a=(a?a.j&128||a.ub||(a.j?0:y(cb,a)):y(cb,a))?this.ma.la(null):J(this.ma);return null!=a?new Ff(a,this.oa):nc};l.M=function(){return this};l.F=function(a,b){return new Ff(this.ma,b)};l.N=function(a,b){return L(b,this)};Ff.prototype[Ma]=function(){return qc(this)};function Gf(a){return(a=E(a))?new Ff(a,null):null}function pd(a){return mb(a)}
var Hf=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new F(e,0)}return b.call(this,d)}function b(a){return w(Vd(a))?Pa.b(function(a,b){return Gc.b(w(a)?a:Y,b)},a):null}a.l=0;a.h=function(a){a=E(a);return b(a)};a.d=b;return a}();function If(a,b){for(var c=Y,d=E(b);;)if(d)var e=H(d),f=R.c(a,e,Jf),c=Sd.b(f,Jf)?Jc.c(c,e,f):c,d=J(d);else return Nc(c,Oc(a))}
function Kf(a,b,c){this.o=a;this.Ta=b;this.n=c;this.j=15077647;this.q=8196}l=Kf.prototype;l.toString=function(){return $b(this)};l.keys=function(){return qc(E(this))};l.J=function(a,b){return fb.c(this,b,null)};l.I=function(a,b,c){return gb(this.Ta,b)?b:c};l.A=function(){return this.o};l.O=function(){return Ta(this.Ta)};l.D=function(){var a=this.n;return null!=a?a:this.n=a=uc(this)};l.C=function(a,b){return Rc(b)&&O(this)===O(b)&&Ud(function(a){return function(b){return cd(a,b)}}(this),b)};l.Xa=function(){return new Lf(Lb(this.Ta))};
l.U=function(){return Nc(Mf,this.o)};l.Ub=function(a,b){return new Kf(this.o,jb(this.Ta,b),null)};l.M=function(){return df(this.Ta)};l.F=function(a,b){return new Kf(b,this.Ta,this.n)};l.N=function(a,b){return new Kf(this.o,Jc.c(this.Ta,b,null),null)};
l.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();l.apply=function(a,b){return this.call.apply(this,[this].concat(Na(b)))};l.a=function(a){return this.J(null,a)};l.b=function(a,b){return this.I(null,a,b)};var Mf=new Kf(null,Y,vc);
function Nf(a){var b=a.length;if(b<=ff)for(var c=0,d=Lb(Y);;)if(c<b)var e=c+1,d=Ob(d,a[c],null),c=e;else return new Kf(null,Nb(d),null);else for(c=0,d=Lb(Mf);;)if(c<b)e=c+1,d=Mb(d,a[c]),c=e;else return Nb(d)}Kf.prototype[Ma]=function(){return qc(this)};function Lf(a){this.Ja=a;this.j=259;this.q=136}l=Lf.prototype;
l.call=function(){function a(a,b,c){return fb.c(this.Ja,b,$c)===$c?c:b}function b(a,b){return fb.c(this.Ja,b,$c)===$c?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();l.apply=function(a,b){return this.call.apply(this,[this].concat(Na(b)))};l.a=function(a){return fb.c(this.Ja,a,$c)===$c?null:a};l.b=function(a,b){return fb.c(this.Ja,a,$c)===$c?b:a};
l.J=function(a,b){return fb.c(this,b,null)};l.I=function(a,b,c){return fb.c(this.Ja,b,$c)===$c?c:b};l.O=function(){return O(this.Ja)};l.Qa=function(a,b){this.Ja=Qd.c(this.Ja,b,null);return this};l.Ra=function(){return new Kf(null,Nb(this.Ja),null)};
function Of(a){a=E(a);if(null==a)return Mf;if(a instanceof F&&0===a.p){a=a.e;a:{for(var b=0,c=Lb(Mf);;)if(b<a.length)var d=b+1,c=c.Qa(null,a[b]),b=d;else{a=c;break a}a=void 0}return a.Ra(null)}for(d=Lb(Mf);;)if(null!=a)b=a.la(null),d=d.Qa(null,a.ga(null)),a=b;else return d.Ra(null)}function wd(a){if(a&&(a.q&4096||a.Uc))return a.hb(null);if("string"===typeof a)return a;throw Error([B("Doesn't support name: "),B(a)].join(""));}
var Pf=function(){function a(a,b,c){return(a.a?a.a(b):a.call(null,b))>(a.a?a.a(c):a.call(null,c))?b:c}var b=null,c=function(){function a(b,d,h,k){var m=null;if(3<arguments.length){for(var m=0,n=Array(arguments.length-3);m<n.length;)n[m]=arguments[m+3],++m;m=new F(n,0)}return c.call(this,b,d,h,m)}function c(a,d,e,k){return Pa.c(function(c,d){return b.c(a,c,d)},b.c(a,d,e),k)}a.l=3;a.h=function(a){var b=H(a);a=J(a);var d=H(a);a=J(a);var k=H(a);a=I(a);return c(b,d,k,a)};a.d=c;return a}(),b=function(b,
e,f,g){switch(arguments.length){case 2:return e;case 3:return a.call(this,b,e,f);default:var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+3],++h;h=new F(k,0)}return c.d(b,e,f,h)}throw Error("Invalid arity: "+arguments.length);};b.l=3;b.h=c.h;b.b=function(a,b){return b};b.c=a;b.d=c.d;return b}();function Qf(a,b,c){this.p=a;this.end=b;this.step=c}Qf.prototype.Ab=function(){return 0<this.step?this.p<this.end:this.p>this.end};
Qf.prototype.next=function(){var a=this.p;this.p+=this.step;return a};function Rf(a,b,c,d,e){this.o=a;this.start=b;this.end=c;this.step=d;this.n=e;this.j=32375006;this.q=8192}l=Rf.prototype;l.toString=function(){return $b(this)};l.v=function(a,b){if(b<Ta(this))return this.start+b*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};l.ta=function(a,b,c){return b<Ta(this)?this.start+b*this.step:this.start>this.end&&0===this.step?this.start:c};
l.gb=function(){return new Qf(this.start,this.end,this.step)};l.A=function(){return this.o};l.la=function(){return 0<this.step?this.start+this.step<this.end?new Rf(this.o,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new Rf(this.o,this.start+this.step,this.end,this.step,null):null};l.O=function(){if(Ja(Db(this)))return 0;var a=(this.end-this.start)/this.step;return Math.ceil.a?Math.ceil.a(a):Math.ceil.call(null,a)};
l.D=function(){var a=this.n;return null!=a?a:this.n=a=sc(this)};l.C=function(a,b){return Dc(this,b)};l.U=function(){return Nc(nc,this.o)};l.ja=function(a,b){return yc.b(this,b)};l.ka=function(a,b,c){for(a=this.start;;)if(0<this.step?a<this.end:a>this.end){var d=a;c=b.b?b.b(c,d):b.call(null,c,d);if(xc(c))return b=c,K.a?K.a(b):K.call(null,b);a+=this.step}else return c};l.ga=function(){return null==Db(this)?null:this.start};
l.sa=function(){return null!=Db(this)?new Rf(this.o,this.start+this.step,this.end,this.step,null):nc};l.M=function(){return 0<this.step?this.start<this.end?this:null:this.start>this.end?this:null};l.F=function(a,b){return new Rf(b,this.start,this.end,this.step,this.n)};l.N=function(a,b){return L(b,this)};Rf.prototype[Ma]=function(){return qc(this)};
var Sf=function(){function a(a,b,c){return new Rf(null,a,b,c,null)}function b(a,b){return e.c(a,b,1)}function c(a){return e.c(0,a,1)}function d(){return e.c(0,Number.MAX_VALUE,1)}var e=null,e=function(e,g,h){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,e);case 2:return b.call(this,e,g);case 3:return a.call(this,e,g,h)}throw Error("Invalid arity: "+arguments.length);};e.m=d;e.a=c;e.b=b;e.c=a;return e}(),Tf=function(){function a(a,b){for(;;)if(E(b)&&0<a){var c=a-1,g=
J(b);a=c;b=g}else return null}function b(a){for(;;)if(E(a))a=J(a);else return null}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}(),Uf=function(){function a(a,b){Tf.b(a,b);return b}function b(a){Tf.a(a);return a}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);
};c.a=b;c.b=a;return c}();function Vf(a,b,c,d,e,f,g){var h=wa;wa=null==wa?null:wa-1;try{if(null!=wa&&0>wa)return Fb(a,"#");Fb(a,c);if(0===Ia.a(f))E(g)&&Fb(a,"...");else{if(E(g)){var k=H(g);b.c?b.c(k,a,f):b.call(null,k,a,f)}for(var m=J(g),n=Ia.a(f)-1;;)if(!m||null!=n&&0===n){E(m)&&0===n&&(Fb(a,d),Fb(a,"..."));break}else{Fb(a,d);var p=H(m);c=a;g=f;b.c?b.c(p,c,g):b.call(null,p,c,g);var q=J(m);c=n-1;m=q;n=c}}return Fb(a,e)}finally{wa=h}}
var Wf=function(){function a(a,d){var e=null;if(1<arguments.length){for(var e=0,f=Array(arguments.length-1);e<f.length;)f[e]=arguments[e+1],++e;e=new F(f,0)}return b.call(this,a,e)}function b(a,b){for(var e=E(b),f=null,g=0,h=0;;)if(h<g){var k=f.v(null,h);Fb(a,k);h+=1}else if(e=E(e))f=e,Wc(f)?(e=Rb(f),g=Sb(f),f=e,k=O(e),e=g,g=k):(k=H(f),Fb(a,k),e=J(f),f=null,g=0),h=0;else return null}a.l=1;a.h=function(a){var d=H(a);a=I(a);return b(d,a)};a.d=b;return a}(),Xf={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f",
"\n":"\\n","\r":"\\r","\t":"\\t"};function Yf(a){return[B('"'),B(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Xf[a]})),B('"')].join("")}
var ag=function Zf(b,c,d){if(null==b)return Fb(c,"nil");if(void 0===b)return Fb(c,"#\x3cundefined\x3e");w(function(){var c=R.b(d,Ga);return w(c)?(c=b?b.j&131072||b.Tc?!0:b.j?!1:y(sb,b):y(sb,b))?Oc(b):c:c}())&&(Fb(c,"^"),Zf(Oc(b),c,d),Fb(c," "));if(null==b)return Fb(c,"nil");if(b.Za)return b.lb(b,c,d);if(b&&(b.j&2147483648||b.S))return b.w(null,c,d);if(Ka(b)===Boolean||"number"===typeof b)return Fb(c,""+B(b));if(null!=b&&b.constructor===Object){Fb(c,"#js ");var e=ge.b(function(c){return new V(null,
2,5,X,[yd.a(c),b[c]],null)},Xc(b));return $f.i?$f.i(e,Zf,c,d):$f.call(null,e,Zf,c,d)}return b instanceof Array?Vf(c,Zf,"#js ["," ","]",d,b):w("string"==typeof b)?w(Ea.a(d))?Fb(c,Yf(b)):Fb(c,b):Lc(b)?Wf.d(c,N(["#\x3c",""+B(b),"\x3e"],0)):b instanceof Date?(e=function(b,c){for(var d=""+B(b);;)if(O(d)<c)d=[B("0"),B(d)].join("");else return d},Wf.d(c,N(['#inst "',""+B(b.getUTCFullYear()),"-",e(b.getUTCMonth()+1,2),"-",e(b.getUTCDate(),2),"T",e(b.getUTCHours(),2),":",e(b.getUTCMinutes(),2),":",e(b.getUTCSeconds(),
2),".",e(b.getUTCMilliseconds(),3),"-",'00:00"'],0))):b instanceof RegExp?Wf.d(c,N(['#"',b.source,'"'],0)):(b?b.j&2147483648||b.S||(b.j?0:y(Gb,b)):y(Gb,b))?Hb(b,c,d):Wf.d(c,N(["#\x3c",""+B(b),"\x3e"],0))};
function bg(a,b){var c;if(null==a||Ja(E(a)))c="";else{c=B;var d=new oa;a:{var e=new Zb(d);ag(H(a),e,b);for(var f=E(J(a)),g=null,h=0,k=0;;)if(k<h){var m=g.v(null,k);Fb(e," ");ag(m,e,b);k+=1}else if(f=E(f))g=f,Wc(g)?(f=Rb(g),h=Sb(g),g=f,m=O(f),f=h,h=m):(m=H(g),Fb(e," "),ag(m,e,b),f=J(g),g=null,h=0),k=0;else break a}c=""+c(d)}return c}
var de=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new F(e,0)}return b.call(this,d)}function b(a){return bg(a,Ca())}a.l=0;a.h=function(a){a=E(a);return b(a)};a.d=b;return a}(),cg=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new F(e,0)}return b.call(this,d)}function b(a){var b=Jc.c(Ca(),Ea,!1);a=bg(a,b);ua.a?ua.a(a):
ua.call(null,a);w(va)?(a=Ca(),ua.a?ua.a("\n"):ua.call(null,"\n"),a=(R.b(a,Da),null)):a=null;return a}a.l=0;a.h=function(a){a=E(a);return b(a)};a.d=b;return a}();function $f(a,b,c,d){return Vf(c,function(a,c,d){var h=lb(a);b.c?b.c(h,c,d):b.call(null,h,c,d);Fb(c," ");a=mb(a);return b.c?b.c(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,E(a))}fe.prototype.S=!0;fe.prototype.w=function(a,b,c){Fb(b,"#\x3cVolatile: ");ag(this.state,b,c);return Fb(b,"\x3e")};F.prototype.S=!0;
F.prototype.w=function(a,b,c){return Vf(b,ag,"("," ",")",c,this)};zd.prototype.S=!0;zd.prototype.w=function(a,b,c){return Vf(b,ag,"("," ",")",c,this)};xf.prototype.S=!0;xf.prototype.w=function(a,b,c){return Vf(b,ag,"("," ",")",c,this)};bf.prototype.S=!0;bf.prototype.w=function(a,b,c){return Vf(b,ag,"("," ",")",c,this)};Re.prototype.S=!0;Re.prototype.w=function(a,b,c){return Vf(b,ag,"("," ",")",c,this)};td.prototype.S=!0;td.prototype.w=function(a,b,c){return Vf(b,ag,"("," ",")",c,this)};
zf.prototype.S=!0;zf.prototype.w=function(a,b,c){return $f(this,ag,b,c)};yf.prototype.S=!0;yf.prototype.w=function(a,b,c){return Vf(b,ag,"("," ",")",c,this)};Te.prototype.S=!0;Te.prototype.w=function(a,b,c){return Vf(b,ag,"["," ","]",c,this)};Kf.prototype.S=!0;Kf.prototype.w=function(a,b,c){return Vf(b,ag,"#{"," ","}",c,this)};Fd.prototype.S=!0;Fd.prototype.w=function(a,b,c){return Vf(b,ag,"("," ",")",c,this)};Zd.prototype.S=!0;
Zd.prototype.w=function(a,b,c){Fb(b,"#\x3cAtom: ");ag(this.state,b,c);return Fb(b,"\x3e")};Ff.prototype.S=!0;Ff.prototype.w=function(a,b,c){return Vf(b,ag,"("," ",")",c,this)};V.prototype.S=!0;V.prototype.w=function(a,b,c){return Vf(b,ag,"["," ","]",c,this)};rd.prototype.S=!0;rd.prototype.w=function(a,b){return Fb(b,"()")};v.prototype.S=!0;v.prototype.w=function(a,b,c){return $f(this,ag,b,c)};Rf.prototype.S=!0;Rf.prototype.w=function(a,b,c){return Vf(b,ag,"("," ",")",c,this)};Ef.prototype.S=!0;
Ef.prototype.w=function(a,b,c){return Vf(b,ag,"("," ",")",c,this)};qd.prototype.S=!0;qd.prototype.w=function(a,b,c){return Vf(b,ag,"("," ",")",c,this)};V.prototype.sb=!0;V.prototype.tb=function(a,b){return ed.b(this,b)};Te.prototype.sb=!0;Te.prototype.tb=function(a,b){return ed.b(this,b)};T.prototype.sb=!0;T.prototype.tb=function(a,b){return ud(this,b)};lc.prototype.sb=!0;lc.prototype.tb=function(a,b){return kc(this,b)};function dg(a,b,c){Jb(a,b,c)}var eg={};
function fg(a){if(a?a.Qc:a)return a.Qc(a);var b;b=fg[t(null==a?null:a)];if(!b&&(b=fg._,!b))throw z("IEncodeJS.-clj-\x3ejs",a);return b.call(null,a)}function gg(a){return(a?w(w(null)?null:a.Pc)||(a.Ob?0:y(eg,a)):y(eg,a))?fg(a):"string"===typeof a||"number"===typeof a||a instanceof T||a instanceof lc?hg.a?hg.a(a):hg.call(null,a):de.d(N([a],0))}
var hg=function ig(b){if(null==b)return null;if(b?w(w(null)?null:b.Pc)||(b.Ob?0:y(eg,b)):y(eg,b))return fg(b);if(b instanceof T)return wd(b);if(b instanceof lc)return""+B(b);if(Uc(b)){var c={};b=E(b);for(var d=null,e=0,f=0;;)if(f<e){var g=d.v(null,f),h=Q.c(g,0,null),g=Q.c(g,1,null);c[gg(h)]=ig(g);f+=1}else if(b=E(b))Wc(b)?(e=Rb(b),b=Sb(b),d=e,e=O(e)):(e=H(b),d=Q.c(e,0,null),e=Q.c(e,1,null),c[gg(d)]=ig(e),b=J(b),d=null,e=0),f=0;else break;return c}if(Qc(b)){c=[];b=E(ge.b(ig,b));d=null;for(f=e=0;;)if(f<
e)h=d.v(null,f),c.push(h),f+=1;else if(b=E(b))d=b,Wc(d)?(b=Rb(d),f=Sb(d),d=b,e=O(b),b=f):(b=H(d),c.push(b),b=J(d),d=null,e=0),f=0;else break;return c}return b},jg={};function kg(a,b){if(a?a.Oc:a)return a.Oc(a,b);var c;c=kg[t(null==a?null:a)];if(!c&&(c=kg._,!c))throw z("IEncodeClojure.-js-\x3eclj",a);return c.call(null,a,b)}
var mg=function(){function a(a){return b.d(a,N([new v(null,1,[lg,!1],null)],0))}var b=null,c=function(){function a(c,d){var h=null;if(1<arguments.length){for(var h=0,k=Array(arguments.length-1);h<k.length;)k[h]=arguments[h+1],++h;h=new F(k,0)}return b.call(this,c,h)}function b(a,c){var d=ad(c)?S.b($d,c):c,e=R.b(d,lg);return function(a,b,d,e){return function s(f){return(f?w(w(null)?null:f.sd)||(f.Ob?0:y(jg,f)):y(jg,f))?kg(f,S.b(Df,c)):ad(f)?Uf.a(ge.b(s,f)):Qc(f)?le.b(null==f?null:Ua(f),ge.b(s,f)):
f instanceof Array?Qe(ge.b(s,f)):Ka(f)===Object?le.b(Y,function(){return function(a,b,c,d){return function ja(e){return new zd(null,function(a,b,c,d){return function(){for(;;){var a=E(e);if(a){if(Wc(a)){var b=Rb(a),c=O(b),g=Dd(c);return function(){for(var a=0;;)if(a<c){var e=C.b(b,a),h=g,k=X,m;m=e;m=d.a?d.a(m):d.call(null,m);e=new V(null,2,5,k,[m,s(f[e])],null);h.add(e);a+=1}else return!0}()?Gd(g.P(),ja(Sb(a))):Gd(g.P(),null)}var h=H(a);return L(new V(null,2,5,X,[function(){var a=h;return d.a?d.a(a):
d.call(null,a)}(),s(f[h])],null),ja(I(a)))}return null}}}(a,b,c,d),null,null)}}(a,b,d,e)(Xc(f))}()):f}}(c,d,e,w(e)?yd:B)(a)}a.l=1;a.h=function(a){var c=H(a);a=I(a);return b(c,a)};a.d=b;return a}(),b=function(b,e){switch(arguments.length){case 1:return a.call(this,b);default:var f=null;if(1<arguments.length){for(var f=0,g=Array(arguments.length-1);f<g.length;)g[f]=arguments[f+1],++f;f=new F(g,0)}return c.d(b,f)}throw Error("Invalid arity: "+arguments.length);};b.l=1;b.h=c.h;b.a=a;b.d=c.d;return b}();
function ng(a){a*=Math.random.m?Math.random.m():Math.random.call(null);return Math.floor.a?Math.floor.a(a):Math.floor.call(null,a)}var og=null;function pg(){if(null==og){var a=new v(null,3,[qg,Y,rg,Y,sg,Y],null);og=U.a?U.a(a):U.call(null,a)}return og}
var tg=function(){function a(a,b,f){var g=oc.b(b,f);if(!g&&!(g=cd(sg.a(a).call(null,b),f))&&(g=Vc(f))&&(g=Vc(b)))if(g=O(f)===O(b))for(var h=!0,k=0;;)if(h&&k!==O(f))h=c.c(a,function(){var a=k;return b.a?b.a(a):b.call(null,a)}(),function(){var a=k;return f.a?f.a(a):f.call(null,a)}()),k=g=k+1;else return h;else return g;else return g}function b(a,b){return c.c(function(){var a=pg();return K.a?K.a(a):K.call(null,a)}(),a,b)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,
c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}(),ug=function(){function a(a,b){return Td(R.b(qg.a(a),b))}function b(a){return c.b(function(){var a=pg();return K.a?K.a(a):K.call(null,a)}(),a)}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}();
function vg(a,b,c,d){ee.b(a,function(){return K.a?K.a(b):K.call(null,b)});ee.b(c,function(){return K.a?K.a(d):K.call(null,d)})}var xg=function wg(b,c,d){var e=(K.a?K.a(d):K.call(null,d)).call(null,b),e=w(w(e)?e.a?e.a(c):e.call(null,c):e)?!0:null;if(w(e))return e;e=function(){for(var e=ug.a(c);;)if(0<O(e))wg(b,H(e),d),e=I(e);else return null}();if(w(e))return e;e=function(){for(var e=ug.a(b);;)if(0<O(e))wg(H(e),c,d),e=I(e);else return null}();return w(e)?e:!1};
function yg(a,b,c){c=xg(a,b,c);return w(c)?c:tg.b(a,b)}
var Ag=function zg(b,c,d,e,f,g,h){var k=Pa.c(function(e,g){var h=Q.c(g,0,null);Q.c(g,1,null);if(tg.c(K.a?K.a(d):K.call(null,d),c,h)){var k;k=(k=null==e)?k:yg(h,H(e),f);k=w(k)?g:e;if(!w(yg(H(k),h,f)))throw Error([B("Multiple methods in multimethod '"),B(b),B("' match dispatch value: "),B(c),B(" -\x3e "),B(h),B(" and "),B(H(k)),B(", and neither is preferred")].join(""));return k}return e},null,K.a?K.a(e):K.call(null,e));if(w(k)){if(oc.b(K.a?K.a(h):K.call(null,h),K.a?K.a(d):K.call(null,d)))return ee.i(g,
Jc,c,H(J(k))),H(J(k));vg(g,e,h,d);return zg(b,c,d,e,f,g,h)}return null};function Bg(a,b){throw Error([B("No method in multimethod '"),B(a),B("' for dispatch value: "),B(b)].join(""));}function Cg(a,b,c,d,e,f,g,h){this.name=a;this.g=b;this.bd=c;this.Bb=d;this.qb=e;this.ld=f;this.Cb=g;this.rb=h;this.j=4194305;this.q=4352}l=Cg.prototype;l.D=function(){return this[ba]||(this[ba]=++da)};l.hb=function(){return Ub(this.name)};l.ib=function(){return Vb(this.name)};
function Dg(a,b,c){ee.i(a.qb,Jc,b,c);vg(a.Cb,a.qb,a.rb,a.Bb)}function Eg(a,b){oc.b(function(){var b=a.rb;return K.a?K.a(b):K.call(null,b)}(),function(){var b=a.Bb;return K.a?K.a(b):K.call(null,b)}())||vg(a.Cb,a.qb,a.rb,a.Bb);var c=function(){var b=a.Cb;return K.a?K.a(b):K.call(null,b)}().call(null,b);if(w(c))return c;c=Ag(a.name,b,a.Bb,a.qb,a.ld,a.Cb,a.rb);return w(c)?c:function(){var b=a.qb;return K.a?K.a(b):K.call(null,b)}().call(null,a.bd)}
l.call=function(){function a(a,b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x,A,G,D,M,P){a=this;var ja=S.d(a.g,b,c,d,e,N([f,g,h,k,m,n,p,r,q,s,u,x,A,G,D,M,P],0)),xd=Eg(this,ja);w(xd)||Bg(a.name,ja);return S.d(xd,b,c,d,e,N([f,g,h,k,m,n,p,r,q,s,u,x,A,G,D,M,P],0))}function b(a,b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x,A,G,D,M){a=this;var P=a.g.ea?a.g.ea(b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x,A,G,D,M):a.g.call(null,b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x,A,G,D,M),ja=Eg(this,P);w(ja)||Bg(a.name,P);return ja.ea?ja.ea(b,c,d,e,f,g,h,k,m,n,p,r,q,
s,u,x,A,G,D,M):ja.call(null,b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x,A,G,D,M)}function c(a,b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x,A,G,D){a=this;var M=a.g.da?a.g.da(b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x,A,G,D):a.g.call(null,b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x,A,G,D),P=Eg(this,M);w(P)||Bg(a.name,M);return P.da?P.da(b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x,A,G,D):P.call(null,b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x,A,G,D)}function d(a,b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x,A,G){a=this;var D=a.g.ca?a.g.ca(b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x,A,G):a.g.call(null,
b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x,A,G),M=Eg(this,D);w(M)||Bg(a.name,D);return M.ca?M.ca(b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x,A,G):M.call(null,b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x,A,G)}function e(a,b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x,A){a=this;var G=a.g.ba?a.g.ba(b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x,A):a.g.call(null,b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x,A),D=Eg(this,G);w(D)||Bg(a.name,G);return D.ba?D.ba(b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x,A):D.call(null,b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x,A)}function f(a,b,c,d,e,f,g,h,k,m,n,p,r,q,
s,u,x){a=this;var A=a.g.aa?a.g.aa(b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x):a.g.call(null,b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x),G=Eg(this,A);w(G)||Bg(a.name,A);return G.aa?G.aa(b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x):G.call(null,b,c,d,e,f,g,h,k,m,n,p,r,q,s,u,x)}function g(a,b,c,d,e,f,g,h,k,m,n,p,r,q,s,u){a=this;var x=a.g.$?a.g.$(b,c,d,e,f,g,h,k,m,n,p,r,q,s,u):a.g.call(null,b,c,d,e,f,g,h,k,m,n,p,r,q,s,u),A=Eg(this,x);w(A)||Bg(a.name,x);return A.$?A.$(b,c,d,e,f,g,h,k,m,n,p,r,q,s,u):A.call(null,b,c,d,e,f,g,h,k,m,n,p,r,q,
s,u)}function h(a,b,c,d,e,f,g,h,k,m,n,p,r,q,s){a=this;var u=a.g.Z?a.g.Z(b,c,d,e,f,g,h,k,m,n,p,r,q,s):a.g.call(null,b,c,d,e,f,g,h,k,m,n,p,r,q,s),x=Eg(this,u);w(x)||Bg(a.name,u);return x.Z?x.Z(b,c,d,e,f,g,h,k,m,n,p,r,q,s):x.call(null,b,c,d,e,f,g,h,k,m,n,p,r,q,s)}function k(a,b,c,d,e,f,g,h,k,m,n,p,r,q){a=this;var s=a.g.Y?a.g.Y(b,c,d,e,f,g,h,k,m,n,p,r,q):a.g.call(null,b,c,d,e,f,g,h,k,m,n,p,r,q),u=Eg(this,s);w(u)||Bg(a.name,s);return u.Y?u.Y(b,c,d,e,f,g,h,k,m,n,p,r,q):u.call(null,b,c,d,e,f,g,h,k,m,n,p,
r,q)}function m(a,b,c,d,e,f,g,h,k,m,n,p,r){a=this;var q=a.g.X?a.g.X(b,c,d,e,f,g,h,k,m,n,p,r):a.g.call(null,b,c,d,e,f,g,h,k,m,n,p,r),s=Eg(this,q);w(s)||Bg(a.name,q);return s.X?s.X(b,c,d,e,f,g,h,k,m,n,p,r):s.call(null,b,c,d,e,f,g,h,k,m,n,p,r)}function n(a,b,c,d,e,f,g,h,k,m,n,p){a=this;var r=a.g.W?a.g.W(b,c,d,e,f,g,h,k,m,n,p):a.g.call(null,b,c,d,e,f,g,h,k,m,n,p),q=Eg(this,r);w(q)||Bg(a.name,r);return q.W?q.W(b,c,d,e,f,g,h,k,m,n,p):q.call(null,b,c,d,e,f,g,h,k,m,n,p)}function p(a,b,c,d,e,f,g,h,k,m,n){a=
this;var p=a.g.V?a.g.V(b,c,d,e,f,g,h,k,m,n):a.g.call(null,b,c,d,e,f,g,h,k,m,n),r=Eg(this,p);w(r)||Bg(a.name,p);return r.V?r.V(b,c,d,e,f,g,h,k,m,n):r.call(null,b,c,d,e,f,g,h,k,m,n)}function q(a,b,c,d,e,f,g,h,k,m){a=this;var n=a.g.fa?a.g.fa(b,c,d,e,f,g,h,k,m):a.g.call(null,b,c,d,e,f,g,h,k,m),p=Eg(this,n);w(p)||Bg(a.name,n);return p.fa?p.fa(b,c,d,e,f,g,h,k,m):p.call(null,b,c,d,e,f,g,h,k,m)}function r(a,b,c,d,e,f,g,h,k){a=this;var m=a.g.R?a.g.R(b,c,d,e,f,g,h,k):a.g.call(null,b,c,d,e,f,g,h,k),n=Eg(this,
m);w(n)||Bg(a.name,m);return n.R?n.R(b,c,d,e,f,g,h,k):n.call(null,b,c,d,e,f,g,h,k)}function s(a,b,c,d,e,f,g,h){a=this;var k=a.g.Q?a.g.Q(b,c,d,e,f,g,h):a.g.call(null,b,c,d,e,f,g,h),m=Eg(this,k);w(m)||Bg(a.name,k);return m.Q?m.Q(b,c,d,e,f,g,h):m.call(null,b,c,d,e,f,g,h)}function u(a,b,c,d,e,f,g){a=this;var h=a.g.t?a.g.t(b,c,d,e,f,g):a.g.call(null,b,c,d,e,f,g),k=Eg(this,h);w(k)||Bg(a.name,h);return k.t?k.t(b,c,d,e,f,g):k.call(null,b,c,d,e,f,g)}function x(a,b,c,d,e,f){a=this;var g=a.g.s?a.g.s(b,c,d,e,
f):a.g.call(null,b,c,d,e,f),h=Eg(this,g);w(h)||Bg(a.name,g);return h.s?h.s(b,c,d,e,f):h.call(null,b,c,d,e,f)}function A(a,b,c,d,e){a=this;var f=a.g.i?a.g.i(b,c,d,e):a.g.call(null,b,c,d,e),g=Eg(this,f);w(g)||Bg(a.name,f);return g.i?g.i(b,c,d,e):g.call(null,b,c,d,e)}function G(a,b,c,d){a=this;var e=a.g.c?a.g.c(b,c,d):a.g.call(null,b,c,d),f=Eg(this,e);w(f)||Bg(a.name,e);return f.c?f.c(b,c,d):f.call(null,b,c,d)}function M(a,b,c){a=this;var d=a.g.b?a.g.b(b,c):a.g.call(null,b,c),e=Eg(this,d);w(e)||Bg(a.name,
d);return e.b?e.b(b,c):e.call(null,b,c)}function P(a,b){a=this;var c=a.g.a?a.g.a(b):a.g.call(null,b),d=Eg(this,c);w(d)||Bg(a.name,c);return d.a?d.a(b):d.call(null,b)}function ja(a){a=this;var b=a.g.m?a.g.m():a.g.call(null),c=Eg(this,b);w(c)||Bg(a.name,b);return c.m?c.m():c.call(null)}var D=null,D=function(D,W,Z,ea,ca,fa,ga,la,pa,ta,xa,ya,Aa,tb,Fa,Xa,db,Ya,Ab,gc,Sc,ae){switch(arguments.length){case 1:return ja.call(this,D);case 2:return P.call(this,D,W);case 3:return M.call(this,D,W,Z);case 4:return G.call(this,
D,W,Z,ea);case 5:return A.call(this,D,W,Z,ea,ca);case 6:return x.call(this,D,W,Z,ea,ca,fa);case 7:return u.call(this,D,W,Z,ea,ca,fa,ga);case 8:return s.call(this,D,W,Z,ea,ca,fa,ga,la);case 9:return r.call(this,D,W,Z,ea,ca,fa,ga,la,pa);case 10:return q.call(this,D,W,Z,ea,ca,fa,ga,la,pa,ta);case 11:return p.call(this,D,W,Z,ea,ca,fa,ga,la,pa,ta,xa);case 12:return n.call(this,D,W,Z,ea,ca,fa,ga,la,pa,ta,xa,ya);case 13:return m.call(this,D,W,Z,ea,ca,fa,ga,la,pa,ta,xa,ya,Aa);case 14:return k.call(this,D,
W,Z,ea,ca,fa,ga,la,pa,ta,xa,ya,Aa,tb);case 15:return h.call(this,D,W,Z,ea,ca,fa,ga,la,pa,ta,xa,ya,Aa,tb,Fa);case 16:return g.call(this,D,W,Z,ea,ca,fa,ga,la,pa,ta,xa,ya,Aa,tb,Fa,Xa);case 17:return f.call(this,D,W,Z,ea,ca,fa,ga,la,pa,ta,xa,ya,Aa,tb,Fa,Xa,db);case 18:return e.call(this,D,W,Z,ea,ca,fa,ga,la,pa,ta,xa,ya,Aa,tb,Fa,Xa,db,Ya);case 19:return d.call(this,D,W,Z,ea,ca,fa,ga,la,pa,ta,xa,ya,Aa,tb,Fa,Xa,db,Ya,Ab);case 20:return c.call(this,D,W,Z,ea,ca,fa,ga,la,pa,ta,xa,ya,Aa,tb,Fa,Xa,db,Ya,Ab,gc);
case 21:return b.call(this,D,W,Z,ea,ca,fa,ga,la,pa,ta,xa,ya,Aa,tb,Fa,Xa,db,Ya,Ab,gc,Sc);case 22:return a.call(this,D,W,Z,ea,ca,fa,ga,la,pa,ta,xa,ya,Aa,tb,Fa,Xa,db,Ya,Ab,gc,Sc,ae)}throw Error("Invalid arity: "+arguments.length);};D.a=ja;D.b=P;D.c=M;D.i=G;D.s=A;D.t=x;D.Q=u;D.R=s;D.fa=r;D.V=q;D.W=p;D.X=n;D.Y=m;D.Z=k;D.$=h;D.aa=g;D.ba=f;D.ca=e;D.da=d;D.ea=c;D.Jb=b;D.fb=a;return D}();l.apply=function(a,b){return this.call.apply(this,[this].concat(Na(b)))};
l.m=function(){var a=this.g.m?this.g.m():this.g.call(null),b=Eg(this,a);w(b)||Bg(this.name,a);return b.m?b.m():b.call(null)};l.a=function(a){var b=this.g.a?this.g.a(a):this.g.call(null,a),c=Eg(this,b);w(c)||Bg(this.name,b);return c.a?c.a(a):c.call(null,a)};l.b=function(a,b){var c=this.g.b?this.g.b(a,b):this.g.call(null,a,b),d=Eg(this,c);w(d)||Bg(this.name,c);return d.b?d.b(a,b):d.call(null,a,b)};
l.c=function(a,b,c){var d=this.g.c?this.g.c(a,b,c):this.g.call(null,a,b,c),e=Eg(this,d);w(e)||Bg(this.name,d);return e.c?e.c(a,b,c):e.call(null,a,b,c)};l.i=function(a,b,c,d){var e=this.g.i?this.g.i(a,b,c,d):this.g.call(null,a,b,c,d),f=Eg(this,e);w(f)||Bg(this.name,e);return f.i?f.i(a,b,c,d):f.call(null,a,b,c,d)};l.s=function(a,b,c,d,e){var f=this.g.s?this.g.s(a,b,c,d,e):this.g.call(null,a,b,c,d,e),g=Eg(this,f);w(g)||Bg(this.name,f);return g.s?g.s(a,b,c,d,e):g.call(null,a,b,c,d,e)};
l.t=function(a,b,c,d,e,f){var g=this.g.t?this.g.t(a,b,c,d,e,f):this.g.call(null,a,b,c,d,e,f),h=Eg(this,g);w(h)||Bg(this.name,g);return h.t?h.t(a,b,c,d,e,f):h.call(null,a,b,c,d,e,f)};l.Q=function(a,b,c,d,e,f,g){var h=this.g.Q?this.g.Q(a,b,c,d,e,f,g):this.g.call(null,a,b,c,d,e,f,g),k=Eg(this,h);w(k)||Bg(this.name,h);return k.Q?k.Q(a,b,c,d,e,f,g):k.call(null,a,b,c,d,e,f,g)};
l.R=function(a,b,c,d,e,f,g,h){var k=this.g.R?this.g.R(a,b,c,d,e,f,g,h):this.g.call(null,a,b,c,d,e,f,g,h),m=Eg(this,k);w(m)||Bg(this.name,k);return m.R?m.R(a,b,c,d,e,f,g,h):m.call(null,a,b,c,d,e,f,g,h)};l.fa=function(a,b,c,d,e,f,g,h,k){var m=this.g.fa?this.g.fa(a,b,c,d,e,f,g,h,k):this.g.call(null,a,b,c,d,e,f,g,h,k),n=Eg(this,m);w(n)||Bg(this.name,m);return n.fa?n.fa(a,b,c,d,e,f,g,h,k):n.call(null,a,b,c,d,e,f,g,h,k)};
l.V=function(a,b,c,d,e,f,g,h,k,m){var n=this.g.V?this.g.V(a,b,c,d,e,f,g,h,k,m):this.g.call(null,a,b,c,d,e,f,g,h,k,m),p=Eg(this,n);w(p)||Bg(this.name,n);return p.V?p.V(a,b,c,d,e,f,g,h,k,m):p.call(null,a,b,c,d,e,f,g,h,k,m)};l.W=function(a,b,c,d,e,f,g,h,k,m,n){var p=this.g.W?this.g.W(a,b,c,d,e,f,g,h,k,m,n):this.g.call(null,a,b,c,d,e,f,g,h,k,m,n),q=Eg(this,p);w(q)||Bg(this.name,p);return q.W?q.W(a,b,c,d,e,f,g,h,k,m,n):q.call(null,a,b,c,d,e,f,g,h,k,m,n)};
l.X=function(a,b,c,d,e,f,g,h,k,m,n,p){var q=this.g.X?this.g.X(a,b,c,d,e,f,g,h,k,m,n,p):this.g.call(null,a,b,c,d,e,f,g,h,k,m,n,p),r=Eg(this,q);w(r)||Bg(this.name,q);return r.X?r.X(a,b,c,d,e,f,g,h,k,m,n,p):r.call(null,a,b,c,d,e,f,g,h,k,m,n,p)};l.Y=function(a,b,c,d,e,f,g,h,k,m,n,p,q){var r=this.g.Y?this.g.Y(a,b,c,d,e,f,g,h,k,m,n,p,q):this.g.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q),s=Eg(this,r);w(s)||Bg(this.name,r);return s.Y?s.Y(a,b,c,d,e,f,g,h,k,m,n,p,q):s.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q)};
l.Z=function(a,b,c,d,e,f,g,h,k,m,n,p,q,r){var s=this.g.Z?this.g.Z(a,b,c,d,e,f,g,h,k,m,n,p,q,r):this.g.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q,r),u=Eg(this,s);w(u)||Bg(this.name,s);return u.Z?u.Z(a,b,c,d,e,f,g,h,k,m,n,p,q,r):u.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q,r)};
l.$=function(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s){var u=this.g.$?this.g.$(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s):this.g.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q,r,s),x=Eg(this,u);w(x)||Bg(this.name,u);return x.$?x.$(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s):x.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q,r,s)};
l.aa=function(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u){var x=this.g.aa?this.g.aa(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u):this.g.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u),A=Eg(this,x);w(A)||Bg(this.name,x);return A.aa?A.aa(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u):A.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u)};
l.ba=function(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x){var A=this.g.ba?this.g.ba(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x):this.g.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x),G=Eg(this,A);w(G)||Bg(this.name,A);return G.ba?G.ba(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x):G.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x)};
l.ca=function(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A){var G=this.g.ca?this.g.ca(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A):this.g.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A),M=Eg(this,G);w(M)||Bg(this.name,G);return M.ca?M.ca(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A):M.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A)};
l.da=function(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G){var M=this.g.da?this.g.da(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G):this.g.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G),P=Eg(this,M);w(P)||Bg(this.name,M);return P.da?P.da(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G):P.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G)};
l.ea=function(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G,M){var P=this.g.ea?this.g.ea(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G,M):this.g.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G,M),ja=Eg(this,P);w(ja)||Bg(this.name,P);return ja.ea?ja.ea(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G,M):ja.call(null,a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G,M)};
l.Jb=function(a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,G,M,P){var ja=S.d(this.g,a,b,c,d,N([e,f,g,h,k,m,n,p,q,r,s,u,x,A,G,M,P],0)),D=Eg(this,ja);w(D)||Bg(this.name,ja);return S.d(D,a,b,c,d,N([e,f,g,h,k,m,n,p,q,r,s,u,x,A,G,M,P],0))};function Fg(a){this.Db=a;this.q=0;this.j=2153775104}Fg.prototype.D=function(){for(var a=de.d(N([this],0)),b=0,c=0;c<a.length;++c)b=31*b+a.charCodeAt(c),b%=4294967296;return b};Fg.prototype.w=function(a,b){return Fb(b,[B('#uuid "'),B(this.Db),B('"')].join(""))};
Fg.prototype.C=function(a,b){return b instanceof Fg&&this.Db===b.Db};Fg.prototype.toString=function(){return this.Db};var Gg;a:{var Hg=aa.navigator;if(Hg){var Ig=Hg.userAgent;if(Ig){Gg=Ig;break a}}Gg=""}function Jg(a){return-1!=Gg.indexOf(a)};var Kg=Jg("Opera")||Jg("OPR"),Lg=Jg("Trident")||Jg("MSIE"),Mg=Jg("Gecko")&&-1==Gg.toLowerCase().indexOf("webkit")&&!(Jg("Trident")||Jg("MSIE")),Ng=-1!=Gg.toLowerCase().indexOf("webkit");(function(){var a="",b;if(Kg&&aa.opera)return a=aa.opera.version,"function"==t(a)?a():a;Mg?b=/rv\:([^\);]+)(\)|;)/:Lg?b=/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/:Ng&&(b=/WebKit\/(\S+)/);b&&(a=(a=b.exec(Gg))?a[1]:"");return Lg&&(b=(b=aa.document)?b.documentMode:void 0,b>parseFloat(a))?String(b):a})();var Og=null,Pg=null,Qg=Mg||Ng||Kg||"function"==typeof aa.atob;function Rg(){if(!Og){Og={};Pg={};for(var a=0;65>a;a++)Og[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(a),Pg[Og[a]]=a}};var Sg=new T(null,"y","y",-1757859776),Tg=new T(null,"scale-objects","scale-objects",141326624),Ug=new T(null,"prefer-low-power-to-high-performance","prefer-low-power-to-high-performance",173664672),Vg=new T(null,"post-render","post-render",-563595808),Wg=new T(null,"clampLower","clampLower",1717322432),Xg=new T(null,"point-buffer","point-buffer",-38210816),Yg=new T(null,"rgb_f","rgb_f",219331681),Zg=new T(null,"preserve-drawing-buffer","preserve-drawing-buffer",-529745663),$g=new T(null,"capabilities",
"capabilities",212739361),ah=new T(null,"projectionMatrix","projectionMatrix",-1041365631),bh=new T(null,"addPropertyListener","addPropertyListener",1694623393),ch=new T(null,"point-stride","point-stride",-2087796991),dh=new T(null,"maxs","maxs",1684246818),eh=new T(null,"imap_f","imap_f",-1429024414),fh=new T(null,"root-state","root-state",1050879363),gh=new T(null,"blend-function","blend-function",1123696099),hh=new T(null,"attribs-id","attribs-id",-2063052093),ih=new T(null,"data-type","data-type",
-326421468),jh=new T(null,"transform","transform",1381301764),Ga=new T(null,"meta","meta",1499536964),kh=new T(null,"screen","screen",1990059748),lh=new T(null,"modelMatrix","modelMatrix",-1126355100),mh=new T(null,"planes","planes",-1342990364),nh=new T(null,"uv-range","uv-range",210839749),oh=new T(null,"modelViewMatrix","modelViewMatrix",-411575099),ph=new T(null,"render-engine","render-engine",-1649726203),Ha=new T(null,"dup","dup",556298533),qh=new T(null,"preferLowPowerToHighPerformance","preferLowPowerToHighPerformance",
-71326203),rh=new T(null,"setTargetPosition","setTargetPosition",-1252850939),sh=new T(null,"intensityBlend","intensityBlend",-1646375738),th=new T(null,"antialias","antialias",-2073640634),uh=new T(null,"int","int",-1741416922),vh=new T(null,"clear-color","clear-color",-1380949274),wh=new T(null,"bbox-params","bbox-params",531518246),xh=new T(null,"ks","ks",1900203942),yh=new T(null,"offset","offset",296498311),zh=new T(null,"db","db",993250759),Ah=new T(null,"setEyePosition","setEyePosition",-2116625977),
Bh=new T(null,"tex","tex",1307057959),Ch=new T(null,"uniforms","uniforms",-782808153),be=new T(null,"validator","validator",-1966190681),Dh=new T(null,"intensity_f","intensity_f",748556456),Ph=new T(null,"default","default",-1987822328),Qh=new T(null,"vec3","vec3",1116680488),Rh=new T(null,"finally-block","finally-block",832982472),Sh=new T(null,"float","float",-1732389368),Th=new T(null,"xyzScale","xyzScale",1117901384),Uh=new T(null,"transpose","transpose",-474726680),Vh=new T(null,"height_f","height_f",
-25417944),Wh=new T(null,"warn","warn",-436710552),Xh=new T(null,"modelViewProjectionMatrix","modelViewProjectionMatrix",-1012685944),Yh=new T(null,"name","name",1843675177),Zh=new T(null,"eye","eye",-1788770007),$h=new T(null,"source-state","source-state",-1680383479),ai=new T(null,"fail-if-major-performance-caveat","fail-if-major-performance-caveat",333849513),bi=new T(null,"addScaleObject","addScaleObject",-892724118),ci=new T(null,"updateCamera","updateCamera",723584298),di=new T(null,"model-matrix",
"model-matrix",-53072598),ei=new T(null,"pickPoint","pickPoint",830964042),fi=new T(null,"dirty?","dirty?",-2059845846),gi=new T(null,"attrib-loader","attrib-loader",-280099829),hi=new T(null,"width","width",-384071477),ii=new T(null,"blend-func","blend-func",-276929269),ji=new T(null,"render-options","render-options",686799147),ki=new T(null,"total-points","total-points",2142237035),li=new T(null,"premultipliedAlpha","premultipliedAlpha",1701284427),mi=new T(null,"element-array","element-array",
38145164),ni=new T(null,"removeAllScaleObjects","removeAllScaleObjects",322968844),$=new T(null,"recur","recur",-437573268),oi=new T(null,"pointSize","pointSize",-796733076),pi=new T(null,"type","type",1174270348),qi=new T(null,"setClearColor","setClearColor",-509340244),ri=new T(null,"premultiplied-alpha","premultiplied-alpha",-307675636),si=new T(null,"catch-block","catch-block",1175212748),ti=new T(null,"mins","mins",467369676),ui=new T(null,"state","state",-1988618099),vi=new T(null,"point-buffers",
"point-buffers",-1078372979),wi=new T(null,"generate-mipmaps?","generate-mipmaps?",-1559457203),Da=new T(null,"flush-on-newline","flush-on-newline",-151457939),xi=new T(null,"setRenderViewSize","setRenderViewSize",-507877395),yi=new T(null,"vec4","vec4",631182126),zi=new T(null,"fov","fov",-12463282),Ai=new T(null,"colorClampLower","colorClampLower",-1918104626),rg=new T(null,"descendants","descendants",1824886031),sg=new T(null,"ancestors","ancestors",-776045424),Bi=new T(null,"circularPoints","circularPoints",
1774672048),Ci=new T(null,"run-state","run-state",-1367818032),Di=new T(null,"addCamera","addCamera",2121447888),Ea=new T(null,"readably","readably",1129599760),Ei=new T(null,"vec2","vec2",-762258640),Fi=new T(null,"failIfMajorPerformanceCaveat","failIfMajorPerformanceCaveat",200641649),Gi=new T(null,"level-of-detail","level-of-detail",1817545009),Hi=new T(null,"position-location","position-location",1180175729),Ii=new T(null,"z","z",-789527183),Ji=new T(null,"normalized?","normalized?",1246099953),
Ki=new T(null,"clampHigher","clampHigher",-413004015),Li=new T(null,"uvrange","uvrange",314855538),Mi=new T(null,"components-per-vertex","components-per-vertex",426723635),Ni=new T(null,"which","which",-1255268941),Oi=new T(null,"priority","priority",1431093715),Pi=new T(null,"removePointBuffer","removePointBuffer",-843939341),Qi=new T(null,"overlay_f","overlay_f",-186818893),Ri=new T(null,"picker-state","picker-state",-1624666221),Ia=new T(null,"print-length","print-length",1931866356),Si=new T(null,
"active","active",1895962068),Ti=new T(null,"gl-buffer","gl-buffer",-1511334444),Ui=new T(null,"applyState","applyState",-2022659564),Vi=new T(null,"values","values",372645556),Wi=new T(null,"addPostRender","addPostRender",834952916),Xi=new T(null,"rt","rt",623480692),Yi=new T(null,"catch-exception","catch-exception",-1997306795),Zi=new T(null,"preserveDrawingBuffer","preserveDrawingBuffer",187464949),$i=new T(null,"current","current",-1088038603),qg=new T(null,"parents","parents",-2027538891),aj=
new T(null,"dp","dp",-1761626539),bj=new T(null,"count","count",2139924085),cj=new T(null,"image-overlay","image-overlay",-1999919467),dj=new T(null,"addPointBuffer","addPointBuffer",1076136853),ej=new T(null,"prev","prev",-1597069226),fj=new T(null,"draw-mode","draw-mode",-1830018794),gj=new T(null,"info","info",-317069002),hj=new T(null,"continue-block","continue-block",-1852047850),ij=new T(null,"mat4","mat4",-237531594),jj=new T(null,"fb","fb",-1331669322),kj=new T(null,"gl","gl",-246422634),
lj=new T(null,"alpha","alpha",-1574982441),mj=new T(null,"pixel-store-modes","pixel-store-modes",1198746295),nj=new T(null,"iheight_f","iheight_f",889620311),oj=new T(null,"internal-pixel-format","internal-pixel-format",-618695817),pj=new T(null,"display","display",242065432),qj=new T(null,"pixel-format","pixel-format",-1609978632),rj=new T(null,"image","image",-58725096),sj=new T(null,"pointSizeAttenuation","pointSizeAttenuation",1923082712),tj=new T(null,"near","near",-1077668328),uj=new T(null,
"error","error",-978969032),vj=new T(null,"depth","depth",1768663640),wj=new T(null,"textures","textures",560681081),xj=new T(null,"x","x",2099068185),yj=new T(null,"zrange","zrange",-168408615),zj=new T(null,"setRenderOptions","setRenderOptions",641207801),Aj=new T(null,"class_f","class_f",-815706183),Bj=new T(null,"do_plane_clipping","do_plane_clipping",-1395404871),Cj=new T(null,"klassRange","klassRange",664134617),Dj=new T(null,"target","target",253001721),Ej=new T(null,"first","first",-644103046),
Fj=new T(null,"far","far",85807546),Gj=new T(null,"visible","visible",-1024216805),Hj=new T(null,"hierarchy","hierarchy",-1053470341),Ij=new T(null,"map_f","map_f",686095835),Jj=new T(null,"render-target","render-target",-567835109),Kj=new T(null,"viewport","viewport",443342715),Lj=new T(null,"loaders","loaders",1141127131),Mj=new T(null,"attributes","attributes",-74013604),Nj=new T(null,"location","location",1815599388),Oj=new T(null,"parameters","parameters",-1229919748),lg=new T(null,"keywordize-keys",
"keywordize-keys",1310784252),Pj=new T(null,"cameras","cameras",-1446544612),Qj=new T(null,"texture-unit","texture-unit",-731109059),Rj=new T(null,"point-size","point-size",-2123819651),Sj=new T(null,"removePropertyListener","removePropertyListener",1093641661),Tj=new T(null,"map","map",1371690461),Uj=new T(null,"stride","stride",-1172818435),Vj=new T(null,"texture","texture",-266291651),Wj=new T(null,"maxColorComponent","maxColorComponent",-1941390691),Xj=new T(null,"shader","shader",1492833021),
Yj=new T(null,"picker","picker",-659389603),Zj=new T(null,"addLoader","addLoader",-1562689378),ak=new T(null,"buffer","buffer",617295198),bk=new T(null,"stencil","stencil",-1049110946),ck=new T(null,"view","view",1247994814),dk=new T(null,"old","old",-1825222690),ek=new T(null,"height","height",1025178622),Jf=new T("cljs.core","not-found","cljs.core/not-found",-1572889185),fk=new T(null,"sstate","sstate",-2029164673),gk=new T(null,"colorClampHigher","colorClampHigher",760735679);var hk=nc,hk=function(){var a=window.requestAnimationFrame;if(w(a))return a;var b=window.webkitRequestAnimationFrame;if(w(b))return b;var c=widnow.mozRequestAnimationFrame;if(w(c))return c;var d=window.msRequestAnimationFrame;return w(d)?d:function(a,b,c,d){return function(k){return window.setTimeout(function(){return function(){var a=(new Date).getTime();return k.a?k.a(a):k.call(null,a)}}(a,b,c,d),10)}}(d,c,b,a)}(),ik=function(){function a(a,d){var e=null;if(1<arguments.length){for(var e=0,f=Array(arguments.length-
1);e<f.length;)f[e]=arguments[e+1],++e;e=new F(f,0)}return b.call(this,a,e)}function b(a,b){function e(){return S.b(a,b)}return hk.a?hk.a(e):hk.call(null,e)}a.l=1;a.h=function(a){var d=H(a);a=I(a);return b(d,a)};a.d=b;return a}();function jk(a,b,c){var d=function(){var a=new v(null,3,[fi,!1,dk,null,$i,null],null);return U.a?U.a(a):U.call(null,a)}();dg(a,b,function(d){return function(f,g,h,k){ee.d(d,Jc,dk,h,N([$i,k],0));if(w(fi.a(K.a?K.a(d):K.call(null,d))))return null;ee.i(d,Jc,fi,!0);return ik(function(d){return function(){var e=K.a?K.a(d):K.call(null,d),f=ad(e)?S.b($d,e):e,e=R.b(f,$i),f=R.b(f,dk);c.i?c.i(a,b,f,e):c.call(null,a,b,f,e);return ee.i(d,Jc,fi,!1)}}(d))}}(d))}
function kk(a){var b=JSON.stringify(a);if(Qg)a=aa.btoa(b);else{a=[];for(var c=0,d=0;d<b.length;d++){for(var e=b.charCodeAt(d);255<e;)a[c++]=e&255,e>>=8;a[c++]=e}b=t(a);if("array"!=b&&("object"!=b||"number"!=typeof a.length))throw Error("encodeByteArray takes an array as a parameter");Rg();b=Og;c=[];for(d=0;d<a.length;d+=3){var f=a[d],g=(e=d+1<a.length)?a[d+1]:0,h=d+2<a.length,k=h?a[d+2]:0,m=f>>2,f=(f&3)<<4|g>>4,g=(g&15)<<2|k>>6,k=k&63;h||(k=64,e||(g=64));c.push(b[m],b[f],b[g],b[k])}a=c.join("")}return a}
function Bk(a){var b;if(Qg)b=aa.atob(a);else{Rg();var c=Pg;b=[];for(var d=0;d<a.length;){var e=c[a.charAt(d++)],f=d<a.length?c[a.charAt(d)]:0;++d;var g=d<a.length?c[a.charAt(d)]:64;++d;var h=d<a.length?c[a.charAt(d)]:64;++d;if(null==e||null==f||null==g||null==h)throw Error();b.push(e<<2|f>>4);64!=g&&(b.push(f<<4&240|g>>2),64!=h&&b.push(g<<6&192|h))}if(8192>b.length)b=String.fromCharCode.apply(null,b);else{a="";for(c=0;c<b.length;c+=8192)a+=String.fromCharCode.apply(null,ra(b,c,c+8192));b=a}}return JSON.parse(b)}
;var Ck,Dk,Ek;function Fk(a,b){if(a?a.Nb:a)return a.Nb(0,b);var c;c=Fk[t(null==a?null:a)];if(!c&&(c=Fk._,!c))throw z("ReadPort.take!",a);return c.call(null,a,b)}function Gk(a,b,c){if(a?a.xb:a)return a.xb(0,b,c);var d;d=Gk[t(null==a?null:a)];if(!d&&(d=Gk._,!d))throw z("WritePort.put!",a);return d.call(null,a,b,c)}function Hk(a){if(a?a.wb:a)return a.wb();var b;b=Hk[t(null==a?null:a)];if(!b&&(b=Hk._,!b))throw z("Channel.close!",a);return b.call(null,a)}
function Ik(a){if(a?a.ua:a)return a.ua(a);var b;b=Ik[t(null==a?null:a)];if(!b&&(b=Ik._,!b))throw z("Handler.active?",a);return b.call(null,a)}function Jk(a){if(a?a.pa:a)return a.pa(a);var b;b=Jk[t(null==a?null:a)];if(!b&&(b=Jk._,!b))throw z("Handler.commit",a);return b.call(null,a)}function Kk(a,b){if(a?a.ac:a)return a.ac(0,b);var c;c=Kk[t(null==a?null:a)];if(!c&&(c=Kk._,!c))throw z("Buffer.add!*",a);return c.call(null,a,b)}
var Lk=function(){function a(a,b){if(null==b)throw Error([B("Assert failed: "),B(de.d(N([sd(new lc(null,"not","not",1044554643,null),sd(new lc(null,"nil?","nil?",1612038930,null),new lc(null,"itm","itm",-713282527,null)))],0)))].join(""));return Kk(a,b)}var b=null,b=function(b,d){switch(arguments.length){case 1:return b;case 2:return a.call(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=function(a){return a};b.b=a;return b}();var Mk,Ok=function Nk(b){"undefined"===typeof Mk&&(Mk=function(b,d,e){this.mb=b;this.Pb=d;this.gd=e;this.q=0;this.j=393216},Mk.prototype.ua=function(){return!0},Mk.prototype.pa=function(){return this.mb},Mk.prototype.A=function(){return this.gd},Mk.prototype.F=function(b,d){return new Mk(this.mb,this.Pb,d)},Mk.Za=!0,Mk.Ya="cljs.core.async.impl.ioc-helpers/t26167",Mk.lb=function(b,d){return Fb(d,"cljs.core.async.impl.ioc-helpers/t26167")});return new Mk(b,Nk,Y)};
function Pk(a){try{return a[0].call(null,a)}catch(b){throw b instanceof Object&&a[6].wb(),b;}}function Qk(a,b,c){c=c.Nb(0,Ok(function(c){a[2]=c;a[1]=b;return Pk(a)}));return w(c)?(a[2]=K.a?K.a(c):K.call(null,c),a[1]=b,$):null}function Rk(a,b,c,d){c=c.xb(0,d,Ok(function(c){a[2]=c;a[1]=b;return Pk(a)}));return w(c)?(a[2]=K.a?K.a(c):K.call(null,c),a[1]=b,$):null}function Sk(a,b){var c=a[6];null!=b&&c.xb(0,b,Ok(function(){return function(){return null}}(c)));c.wb();return c}
function Tk(a){for(;;){var b=a[4],c=si.a(b),d=Yi.a(b),e=a[5];if(w(function(){var a=e;return w(a)?Ja(b):a}()))throw e;if(w(function(){var a=e;return w(a)?(a=c,w(a)?e instanceof d:a):a}())){a[1]=c;a[2]=e;a[5]=null;a[4]=Jc.d(b,si,null,N([Yi,null],0));break}if(w(function(){var a=e;return w(a)?Ja(c)&&Ja(Rh.a(b)):a}()))a[4]=ej.a(b);else{if(w(function(){var a=e;return w(a)?(a=Ja(c))?Rh.a(b):a:a}())){a[1]=Rh.a(b);a[4]=Jc.c(b,Rh,null);break}if(w(function(){var a=Ja(e);return a?Rh.a(b):a}())){a[1]=Rh.a(b);
a[4]=Jc.c(b,Rh,null);break}if(Ja(e)&&Ja(Rh.a(b))){a[1]=hj.a(b);a[4]=ej.a(b);break}throw Error("No matching clause");}}};var Uk;
function Vk(){var a=aa.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&(a=function(){var a=document.createElement("iframe");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=ka(function(a){if(a.origin==d||a.data==c)this.port1.onmessage()},this);
b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a){var b=new a,c={},d=c;b.port1.onmessage=function(){c=c.next;var a=c.eb;c.eb=null;a()};return function(a){d.next={eb:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("script")?function(a){var b=document.createElement("script");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);
b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};var Wk=function(){function a(a,b){var c=new v(null,8,[lj,!0,vj,!0,bk,!1,th,!0,ri,!0,Zg,!1,Ug,!1,ai,!1],null),c=function(){return function(a){var b=ad(a)?S.b($d,a):a;a=R.b(b,ai);var c=R.b(b,Ug),d=R.b(b,Zg),e=R.b(b,ri),f=R.b(b,th),g=R.b(b,bk),s=R.b(b,vj),b=R.b(b,lj);return hg(new v(null,8,[lj,b,vj,s,bk,g,th,f,li,e,Zi,d,qh,c,Fi,a],null))}}(c)(Hf.d(N([c,b],0))),g=a.getContext("experimental-webgl",c);return w(g)?g:a.getContext("webgl",c)}function b(a){return c.b(a,Y)}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,
c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}();function Xk(a,b,c){return a.getAttribLocation(b,c)}function Yk(a,b,c){b=a.createShader(b);a.shaderSource(b,c);a.compileShader(b);if(!w(a.getShaderParameter(b,35713)))throw Error(a.getShaderInfoLog(b));return b}
var Zk=function(){function a(a,d){var e=null;if(1<arguments.length){for(var e=0,f=Array(arguments.length-1);e<f.length;)f[e]=arguments[e+1],++e;e=new F(f,0)}return b.call(this,a,e)}function b(a,b){for(var e=a.createProgram(),f=E(b),g=null,h=0,k=0;;)if(k<h){var m=g.v(null,k);a.attachShader(e,m);k+=1}else if(f=E(f))g=f,Wc(g)?(f=Rb(g),k=Sb(g),g=f,h=O(f),f=k):(f=H(g),a.attachShader(e,f),f=J(g),g=null,h=0),k=0;else break;a.linkProgram(e);if(!w(a.getProgramParameter(e,35714)))throw Error("Could not initialize shaders");
a.useProgram(e);return e}a.l=1;a.h=function(a){var d=H(a);a=I(a);return b(d,a)};a.d=b;return a}();var $k=function(){function a(a,d,e,f,g){var h=null;if(4<arguments.length){for(var h=0,k=Array(arguments.length-4);h<k.length;)k[h]=arguments[h+4],++h;h=new F(k,0)}return b.call(this,a,d,e,f,h)}function b(a,b,e,f,g){g=Q.c(g,0,null);var h=a.createBuffer();a.bindBuffer(e,h);a.bufferData(e,b,f);w(g)&&(h.cd=g,h.Ad=kd(b.length,g));return h}a.l=4;a.h=function(a){var d=H(a);a=J(a);var e=H(a);a=J(a);var f=H(a);a=J(a);var g=H(a);a=I(a);return b(d,e,f,g,a)};a.d=b;return a}();
function al(a,b,c,d,e){a.clearColor(b,c,d,e);a.clear(16384);return a}function bl(a){a.clearDepth(1);a.clear(256)}
function cl(a,b,c){var d=ad(c)?S.b($d,c):c;c=R.b(d,Uh);var e=R.b(d,Vi),f=R.b(d,pi),d=R.b(d,Yh);b=a.getUniformLocation(b,d);switch(f instanceof T?f.qa:null){case "bvec3":a.uniform3fv(b,e);break;case "int":a.uniform1iv(b,e);break;case "mat3":a.uniformMatrix3fv(b,c,e);break;case "vec3":a.uniform3fv(b,e);break;case "float":a.uniform1fv(b,e);break;case "ivec4":a.uniform4iv(b,e);break;case "mat2":a.uniformMatrix2fv(b,c,e);break;case "ivec2":a.uniform2iv(b,e);break;case "vec4":a.uniform4fv(b,e);break;case "vec2":a.uniform2fv(b,
e);break;case "bvec2":a.uniform2fv(b,e);break;case "mat4":a.uniformMatrix4fv(b,c,e);break;case "bvec4":a.uniform4fv(b,e);break;case "bool":a.uniform1fv(b,e);break;case "ivec3":a.uniform3iv(b,e);break}}function dl(a,b){var c=ad(b)?S.b($d,b):b,d=R.b(c,yh),e=R.b(c,Uj),f=R.b(c,Ji),g=R.b(c,pi),h=R.b(c,Mi),k=R.b(c,Nj),c=R.b(c,ak);a.bindBuffer(34962,c);a.enableVertexAttribArray(k);a.vertexAttribPointer(k,w(h)?h:c.cd,w(g)?g:5126,w(f)?f:!1,w(e)?e:0,w(d)?d:0)}
function el(a,b,c){var d=ad(c)?S.b($d,c):c;R.b(d,Qj);c=R.b(d,Yh);d=R.b(d,Vj);a.activeTexture(33984);a.bindTexture(3553,d);a.uniform1i(a.getUniformLocation(b,c),0)}
var fl=Ic([2960,3024,2929,3042,3089,32926,32823,2884,32928],[!1,!0,!1,!1,!1,!1,!1,!1,!1]),gl=function(){function a(a,d){var e=null;if(1<arguments.length){for(var e=0,f=Array(arguments.length-1);e<f.length;)f[e]=arguments[e+1],++e;e=new F(f,0)}return b.call(this,a,e)}function b(a,b){var e=ad(b)?S.b($d,b):b,f=R.b(e,wj),g=R.b(e,Ej),h=R.b(e,Kj),k=R.b(e,Mj),m=R.b(e,Xj),n=R.b(e,$g),p=R.b(e,gh),q=R.b(e,Ch),r=R.b(e,mi),s=R.b(e,bj),u=R.b(e,fj),x=w(h)?h:new v(null,4,[xj,0,Sg,0,hi,a.drawingBufferWidth,ek,a.drawingBufferHeight],
null),A=ad(x)?S.b($d,x):x,G=R.b(A,ek),M=R.b(A,hi),P=R.b(A,Sg),ja=R.b(A,xj);a.viewport(ja,P,M,G);a.useProgram(m);for(var D=E(q),za=null,W=0,Z=0;;)if(Z<W){var ea=za.v(null,Z);cl(a,m,ea);Z+=1}else{var ca=E(D);if(ca){var fa=ca;if(Wc(fa))var ga=Rb(fa),la=Sb(fa),pa=ga,ta=O(ga),D=la,za=pa,W=ta;else{var xa=H(fa);cl(a,m,xa);D=J(fa);za=null;W=0}Z=0}else break}for(var ya=E(k),Aa=null,tb=0,Fa=0;;)if(Fa<tb){var Xa=Aa.v(null,Fa);dl(a,Xa);Fa+=1}else{var db=E(ya);if(db){var Ya=db;if(Wc(Ya))var Ab=Rb(Ya),gc=Sb(Ya),
Sc=Ab,ae=O(Ab),ya=gc,Aa=Sc,tb=ae;else{var Bl=H(Ya);dl(a,Bl);ya=J(Ya);Aa=null;tb=0}Fa=0}else break}for(var xd=E(f),Eh=null,Fh=0,Ae=0;;)if(Ae<Fh){var Qm=Eh.v(null,Ae);el(a,m,Qm);Ae+=1}else{var lk=E(xd);if(lk){var Be=lk;if(Wc(Be))var mk=Rb(Be),Rm=Sb(Be),Sm=mk,Tm=O(mk),xd=Rm,Eh=Sm,Fh=Tm;else{var Um=H(Be);el(a,m,Um);xd=J(Be);Eh=null;Fh=0}Ae=0}else break}for(var Gh=E(Hf.d(N([fl,n],0))),Hh=null,Ih=0,Ce=0;;)if(Ce<Ih){var nk=Hh.v(null,Ce),Vm=Q.c(nk,0,null),Wm=Q.c(nk,1,null),ok=a,pk=Vm;w(Wm)?ok.enable(pk):
ok.disable(pk);Ce+=1}else{var qk=E(Gh);if(qk){var De=qk;if(Wc(De))var rk=Rb(De),Xm=Sb(De),Ym=rk,Zm=O(rk),Gh=Xm,Hh=Ym,Ih=Zm;else{var sk=H(De),$m=Q.c(sk,0,null),an=Q.c(sk,1,null),tk=a,uk=$m;w(an)?tk.enable(uk):tk.disable(uk);Gh=J(De);Hh=null;Ih=0}Ce=0}else break}null==r?a.drawArrays(u,w(g)?g:0,s):(a.bindBuffer(34963,ak.a(r)),a.drawElements(u,s,pi.a(r),yh.a(r)));for(var Jh=E(k),Kh=null,Lh=0,Ee=0;;)if(Ee<Lh){var bn=Kh.v(null,Ee);a.disableVertexAttribArray(Nj.a(bn));Ee+=1}else{var vk=E(Jh);if(vk){var Fe=
vk;if(Wc(Fe))var wk=Rb(Fe),cn=Sb(Fe),dn=wk,en=O(wk),Jh=cn,Kh=dn,Lh=en;else{var fn=H(Fe);a.disableVertexAttribArray(Nj.a(fn));Jh=J(Fe);Kh=null;Lh=0}Ee=0}else break}for(var Mh=E(p),Nh=null,Oh=0,Ge=0;;)if(Ge<Oh){var xk=Nh.v(null,Ge),gn=Q.c(xk,0,null),hn=Q.c(xk,1,null);a.blendFunc(gn,hn);Ge+=1}else{var yk=E(Mh);if(yk){var He=yk;if(Wc(He))var zk=Rb(He),jn=Sb(He),kn=zk,ln=O(zk),Mh=jn,Nh=kn,Oh=ln;else{var Ak=H(He),mn=Q.c(Ak,0,null),nn=Q.c(Ak,1,null);a.blendFunc(mn,nn);Mh=J(He);Nh=null;Oh=0}Ge=0}else break}return a}
a.l=1;a.h=function(a){var d=H(a);a=I(a);return b(d,a)};a.d=b;return a}();var va=!1,ua=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new F(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,Qa.a?Qa.a(a):Qa.call(null,a))}a.l=0;a.h=function(a){a=E(a);return b(a)};a.d=b;return a}(),hl=new v(null,3,[gj,"INFO",Wh,"WARN",uj,"ERROR"],null),il=function(){function a(a,d){var e=null;if(1<arguments.length){for(var e=0,f=Array(arguments.length-1);e<f.length;)f[e]=arguments[e+
1],++e;e=new F(f,0)}return b.call(this,a,e)}function b(a,b){return w(!1)?S.c(cg,a.a?a.a(hl):a.call(null,hl),b):null}a.l=1;a.h=function(a){var d=H(a);a=I(a);return b(d,a)};a.d=b;return a}(),jl=Yd.b(il,gj);Yd.b(il,Wh);Yd.b(il,uj);function kl(){function a(){return ng(16).toString(16)}return new Fg((new oa(a(),a(),a(),a(),a(),a(),a(),a(),"-",a(),a(),a(),a(),"-4",a(),a(),a(),"-",(8|3&ng(15)).toString(16),a(),a(),a(),"-",a(),a(),a(),a(),a(),a(),a(),a(),a(),a(),a(),a())).toString())};var ll=new hf([37440,!1,37441,!1,37443,!1,3317,4,3333,4]),ml=function(){function a(a,d){var e=null;if(1<arguments.length){for(var e=0,f=Array(arguments.length-1);e<f.length;)f[e]=arguments[e+1],++e;e=new F(f,0)}return b.call(this,a,e)}function b(a,b){var e=ad(b)?S.b($d,b):b,f=R.b(e,Oj);R.b(e,ih);var g=R.b(e,qj),h=R.b(e,oj),k=R.b(e,Gi),m=R.b(e,wi),n=R.b(e,mj),p=R.b(e,Dj),q=R.b(e,rj),e=a.createTexture(),p=w(p)?p:3553,n=Hf.d(N([ll,n],0));a.bindTexture(p,e);for(var n=E(n),r=null,s=0,u=0;;)if(u<s){var x=
r.v(null,u),A=Q.c(x,0,null),x=Q.c(x,1,null);a.pixelStorei(A,x);u+=1}else if(n=E(n))Wc(n)?(s=Rb(n),n=Sb(n),r=s,s=O(s)):(s=H(n),r=Q.c(s,0,null),s=Q.c(s,1,null),a.pixelStorei(r,s),n=J(n),r=null,s=0),u=0;else break;a.texImage2D(p,w(k)?k:0,w(h)?h:6408,w(g)?g:6408,5121,q);f=E(f);g=null;for(k=h=0;;)if(k<h)n=g.v(null,k),q=Q.c(n,0,null),n=Q.c(n,1,null),a.texParameteri(p,q,n),k+=1;else if(f=E(f))Wc(f)?(h=Rb(f),f=Sb(f),g=h,h=O(h)):(h=H(f),g=Q.c(h,0,null),h=Q.c(h,1,null),a.texParameteri(p,g,h),f=J(f),g=null,
h=0),k=0;else break;w(m)&&a.generateMipmap(p);a.bindTexture(p,null);return e}a.l=1;a.h=function(a){var d=H(a);a=I(a);return b(d,a)};a.d=b;return a}();function nl(a){var b=Yk(a,35633,ol),c=Yk(a,35632,pl);return Zk.d(a,N([b,c],0))}
var ql=U.a?U.a(null):U.call(null,null),ol="precision mediump float;\n\n   uniform mat4  projectionMatrix;\n   uniform mat4  modelViewMatrix;\n   uniform mat4  modelViewProjectionMatrix;\n   uniform mat4  modelMatrix;\n\n   uniform float pointSize;\n   uniform vec3 xyzScale;\n   uniform vec2 zrange;\n   uniform vec3 offset;\n   uniform vec3 which;\n\n   attribute vec3 position;\n\n   varying vec3 xyz;\n\n   void main() {\n       vec3 fpos \x3d ((position.xyz - offset) * xyzScale).xzy * vec3(-1, 1, 1);\n       vec4 worldPos \x3d modelMatrix * vec4(fpos, 1.0);\n       vec4 mvPosition \x3d modelViewMatrix * worldPos;\n       gl_Position \x3d projectionMatrix * mvPosition;\n       gl_PointSize \x3d pointSize;\n       xyz \x3d which * worldPos.xyz;\n   }",pl=
"precision mediump float;\n\n   varying vec3 xyz;\n   float shift_right(float v, float amt) {\n       v \x3d floor(v) + 0.5;\n       return floor(v / exp2(amt));\n   }\n\n   float shift_left(float v, float amt) {\n       return floor(v * exp2(amt) + 0.5);\n   }\n\n   float mask_last(float v, float bits) {\n       return mod(v, shift_left(1.0, bits));\n   }\n\n   float extract_bits(float num, float from, float to) {\n       from \x3d floor(from + 0.5);\n       to \x3d floor(to + 0.5);\n       return mask_last(shift_right(num, from), to - from);\n   }\n\n   vec4 encode_float(float val) {\n       if (val \x3d\x3d 0.0)\n           return vec4(0, 0, 0, 0);\n\n\n\t   float sign \x3d val \x3e 0.0 ? 0.0 : 1.0;\n\t   val \x3d abs(val);\n       float exponent \x3d floor(log2(val));\n       float biased_exponent \x3d exponent + 127.0;\n       float fraction \x3d ((val / exp2(exponent)) - 1.0) * 8388608.0;\n\n       float t \x3d biased_exponent / 2.0;\n       float last_bit_of_biased_exponent \x3d fract(t) * 2.0;\n       float remaining_bits_of_biased_exponent \x3d floor(t);\n\n       float byte4 \x3d extract_bits(fraction, 0.0, 8.0) / 255.0;\n       float byte3 \x3d extract_bits(fraction, 8.0, 16.0) / 255.0;\n       float byte2 \x3d (last_bit_of_biased_exponent * 128.0 + extract_bits(fraction, 16.0, 23.0)) / 255.0;\n       float byte1 \x3d (sign * 128.0 + remaining_bits_of_biased_exponent) / 255.0;\n       return vec4(byte4, byte3, byte2, byte1);\n   }\n\n   void main() {\n       float s \x3d xyz.x + xyz.y + xyz.z;\n\t   gl_FragColor \x3d encode_float(s); }";function rl(a){return null==a?Fc:Tc(a)?a:new V(null,1,5,X,[a],null)}function sl(a,b){var c=rl(a),d=rl(b);return Md.b(c,d)}
function tl(a,b){return le.b(Y,function(){return function d(b){return new zd(null,function(){for(;;){var f=E(b);if(f){if(Wc(f)){var g=Rb(f),h=O(g),k=Dd(h);return function(){for(var b=0;;)if(b<h){var d=C.b(g,b),e=Q.c(d,0,null),f=Q.c(d,1,null),d=k,m=X,n=e,e=new V(null,2,5,X,[e,f],null),e=a.a?a.a(e):a.call(null,e);d.add(new V(null,2,5,m,[n,e],null));b+=1}else return!0}()?Gd(k.P(),d(Sb(f))):Gd(k.P(),null)}var m=H(f),n=Q.c(m,0,null),p=Q.c(m,1,null);return L(new V(null,2,5,X,[n,function(){var b=new V(null,
2,5,X,[n,p],null);return a.a?a.a(b):a.call(null,b)}()],null),d(I(f)))}return null}},null,null)}(b)}())};var ul=null,vl,wl=U.a?U.a(Y):U.call(null,Y),xl=U.a?U.a(Y):U.call(null,Y),yl=U.a?U.a(Y):U.call(null,Y),zl=U.a?U.a(Y):U.call(null,Y),Al=R.c(Y,Hj,pg());vl=new Cg(mc.b("renderer.engine.attribs","reify-attrib"),H,Ph,Al,wl,xl,yl,zl);var Cl,Dl=U.a?U.a(Y):U.call(null,Y),El=U.a?U.a(Y):U.call(null,Y),Fl=U.a?U.a(Y):U.call(null,Y),Gl=U.a?U.a(Y):U.call(null,Y),Hl=R.c(Y,Hj,pg());Cl=new Cg(mc.b("renderer.engine.attribs","unreify-attrib"),H,Ph,Hl,Dl,El,Fl,Gl);
Dg(vl,Xg,function(a){Q.c(a,0,null);a=Q.c(a,1,null);return new v(null,5,[ch,a.pointStride,Rj,a.pointSize,ki,a.totalPoints,Mj,mg.a(a.attributes),Ti,$k(ul,a.data,34962,35044)],null)});Dg(vl,cj,function(a){Q.c(a,0,null);a=Q.c(a,1,null);return ml.d(ul,N([rj,a.image,mj,new hf([37440,a.needFlip]),Oj,new hf([10241,9729,10240,9729])],0))});function Il(a){return[-a[0],a[2],a[1]]}
Dg(vl,jh,function(a){Q.c(a,0,null);var b=Q.c(a,1,null);a=b.position;var c=[-a[0],a[2],a[1]],d=b.mins,e=b.maxs;a=[1,0,0,0,0,1,0,0,0,0,1,0,c[0],c[1],c[2],1];var b=b.offset,f=Il(d),g=Il(e),h;h=d[0];var k=d[1],m=e[0],n=e[1],p=h+(m-h)/2,q=k+(n-k)/2;h=new V(null,4,5,X,[h-p,k-q,m-p,n-q],null);d=Il(d);e=Il(e);c=Jl.c?Jl.c(c,d,e):Jl.call(null,c,d,e);return new v(null,6,[di,a,yh,b,ti,f,dh,g,nh,h,wh,c],null)});Dg(Cl,Xg,function(a){Q.c(a,0,null);a=Q.c(a,1,null);return ul.deleteBuffer(a)});
Dg(Cl,cj,function(a){Q.c(a,0,null);a=Q.c(a,1,null);return ul.deleteTexture(a)});Dg(Cl,jh,function(a){Q.c(a,0,null);a=Q.c(a,1,null);a=oe.b(a,new V(null,2,5,X,[wh,ak],null));return w(a)?ul.deleteBuffer(a):null});function Kl(a,b,c){if(a?a.Gc:a)return a.Gc(0,b,c);var d;d=Kl[t(null==a?null:a)];if(!d&&(d=Kl._,!d))throw z("IAttribLoader.reify-attribs",a);return d.call(null,a,b,c)}
var Ll=function(){function a(a,b,c){if(a?a.Fc:a)return a.Fc(0,b,c);var g;g=Ll[t(null==a?null:a)];if(!g&&(g=Ll._,!g))throw z("IAttribLoader.attribs-in",a);return g.call(null,a,b,c)}function b(a,b){if(a?a.Ec:a)return a.Ec(0,b);var c;c=Ll[t(null==a?null:a)];if(!c&&(c=Ll._,!c))throw z("IAttribLoader.attribs-in",a);return c.call(null,a,b)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);
};c.b=b;c.c=a;return c}();function Ml(a,b,c,d){this.state=a;this.u=b;this.r=c;this.n=d;this.j=2229667594;this.q=8192}l=Ml.prototype;l.J=function(a,b){return fb.c(this,b,null)};l.I=function(a,b,c){switch(b instanceof T?b.qa:null){case "state":return this.state;default:return R.c(this.r,b,c)}};l.Gc=function(a,b,c){a=ul;ul=b;try{var d=tl(function(){return function(a){return vl.a?vl.a(a):vl.call(null,a)}}(a,this),c),e=""+B(kl());ee.i(this.state,Jc,e,d);return e}finally{ul=a}};
l.Ec=function(a,b){return Ll.c(this,b,Fc)};l.Fc=function(a,b,c){var d=this;a=R.b(function(){var a=d.state;return K.a?K.a(a):K.call(null,a)}(),b);return w(a)?(c=Tc(c)?c:new V(null,1,5,X,[c],null),oe.b(a,c)):null};l.w=function(a,b,c){return Vf(b,function(){return function(a){return Vf(b,ag,""," ","",c,a)}}(this),"#renderer.engine.attribs.AttribCache{",", ","}",c,Md.b(new V(null,1,5,X,[new V(null,2,5,X,[ui,this.state],null)],null),this.r))};l.A=function(){return this.u};l.O=function(){return 1+O(this.r)};
l.D=function(){var a=this.n;return null!=a?a:this.n=a=nd(this)};l.C=function(a,b){return w(w(b)?this.constructor===b.constructor&&$e(this,b):b)?!0:!1};l.La=function(a,b){return cd(new Kf(null,new v(null,1,[ui,null],null),null),b)?Kc.b(Nc(le.b(Y,this),this.u),b):new Ml(this.state,this.u,Td(Kc.b(this.r,b)),null)};l.Ea=function(a,b,c){return w(vd.b?vd.b(ui,b):vd.call(null,ui,b))?new Ml(c,this.u,this.r,null):new Ml(this.state,this.u,Jc.c(this.r,b,c),null)};
l.M=function(){return E(Md.b(new V(null,1,5,X,[new V(null,2,5,X,[ui,this.state],null)],null),this.r))};l.F=function(a,b){return new Ml(this.state,b,this.r,this.n)};l.N=function(a,b){return Vc(b)?hb(this,C.b(b,0),C.b(b,1)):Pa.c(Wa,this,b)};
function Jl(a,b,c){a=Nl.c?Nl.c(a,b,c):Nl.call(null,a,b,c);a=$k(ul,a,34962,35044);b=ul;c=K.a?K.a(ql):K.call(null,ql);if(w(c))b=c;else{c=Yk(b,35633,"attribute vec3 pos; uniform mat4 p, v, m; void main() { gl_Position \x3d p * v * m * vec4(pos, 1.0); }");var d=Yk(b,35632,"void main() { gl_FragColor \x3d vec4(1.0, 1.0, 1.0, 1.0); }");b=Zk.d(b,N([c,d],0));b=ce.b?ce.b(ql,b):ce.call(null,ql,b)}return new v(null,3,[ak,a,Xj,b,Hi,ul.getAttribLocation(b,"pos")],null)}
function Nl(a,b,c){b=me.c(function(b,c){return b-a[c]},b,Sf.m());c=me.c(function(){return function(b,c){return b-a[c]}}(b),c,Sf.m());var d=new Float32Array(72),e=new V(null,12,5,X,[new V(null,2,5,X,[0,1],null),new V(null,2,5,X,[0,2],null),new V(null,2,5,X,[0,4],null),new V(null,2,5,X,[1,3],null),new V(null,2,5,X,[1,5],null),new V(null,2,5,X,[5,7],null),new V(null,2,5,X,[5,4],null),new V(null,2,5,X,[6,7],null),new V(null,2,5,X,[6,4],null),new V(null,2,5,X,[6,2],null),new V(null,2,5,X,[3,2],null),new V(null,
2,5,X,[3,7],null)],null);Uf.a(ge.c(function(a,b,c,d){return function(a,b){var e=Q.c(a,0,null),f=Q.c(a,1,null),e=d(e),f=d(f),g=6*b;c.set(e,g);return c.set(f,g+3)}}(b,c,d,function(a,b){return function(c){var d=R.b(0!=(c&4)?b:a,0),e=R.b(0!=(c&2)?b:a,1);c=R.b(0!=(c&1)?b:a,2);return[d,e,c]}}(b,c,d),e),e,Sf.m()));return d};function Ol(a){return a/180*Math.PI}function Pl(a,b,c,d){a=a.md;var e=c<d?d/c:c/d,f=Ol(function(){var a=zi.a(b);return w(a)?a:75}()),g=function(){var a=tj.a(b);return w(a)?a:.1}(),h=function(){var a=Fj.a(b);return w(a)?a:1E4}();return oc.b(pi.a(b),"perspective")?mat4.perspective(a,f,e,g,h):mat4.ortho(a,c/-2,c/2,d/2,d/-2,g,h)}var Ql=[0,1,0];function Rl(a,b,c){a=a.jd;b=S.b(Oa,b);c=S.b(Oa,c);return mat4.lookAt(a,b,c,Ql)}function Sl(a){a=Wk.a(a);a.md=Array(16);a.jd=Array(16);a.Qb=Array(16);return a}
function Tl(a,b){var c=Tc(a)||oc.b(Ka(a),Array)?a:new V(null,1,5,X,[a],null);if(w((new Kf(null,new v(null,5,[Qh,null,Sh,null,yi,null,Ei,null,ij,null],null),null)).call(null,b)))return new Float32Array(hg(c));if(w((new Kf(null,new v(null,2,[uh,null,Bh,null],null),null)).call(null,b)))return new Int32Array(hg(c));throw Error([B("Don't know how to coerce type: "),B(b)].join(""));}function Ul(a,b,c,d){return Jc.c(a,b,new v(null,3,[Yh,wd(b),pi,c,Vi,Tl(d,c)],null))}
var Vl=mat4.identity(Array(16)),Wl=Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Y,ah,ij,Vl),oh,ij,Vl),Xh,ij,Vl),lh,ij,Vl),oi,Sh,1),sh,Sh,0),Wj,Sh,1),Yg,Sh,0),Aj,Sh,0),Ij,Sh,0),eh,Sh,0),Qi,Sh,0),Dh,Sh,0),Vh,Sh,0),nj,Sh,0),Th,Qh,new V(null,3,5,X,[1,1,1],null)),Wg,Sh,0),Ki,Sh,1),Ai,Sh,0),gk,Sh,1),yj,Ei,new V(null,2,5,X,[0,1],null)),Li,yi,new V(null,4,5,X,[0,0,1,1],null)),yh,Qh,new V(null,3,5,X,[0,0,0],null)),Tj,Bh,0),Cj,Ei,new V(null,2,5,X,[0,1],null)),sj,
Ei,new V(null,2,5,X,[1,0],null)),kh,Ei,new V(null,2,5,X,[1E3,1E3],null)),Bj,uh,0),Bi,uh,0),mh,yi,ie.b(24,0)),Xl=Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Ul(Y,ah,ij,Vl),oh,ij,Vl),Xh,ij,Vl),lh,ij,Vl),oi,Sh,1),Th,Qh,new V(null,3,5,X,[1,1,1],null)),yj,Ei,new V(null,2,5,X,[0,1],null)),yh,Qh,new V(null,3,5,X,[0,0,0],null)),Ni,Qh,new V(null,3,5,X,[0,0,0],null));
function Yl(a,b){return Pa.c(function(a,b){var e=Q.c(b,0,null),f=Q.c(b,1,null);return re.c(a,new V(null,1,5,X,[e],null),function(a,b,c){return function(a){var d=pi.a(a);if(w(d))return Jc.c(a,Vi,Tl(c,d));throw Error([B("Don't know type for field: "),B(b)].join(""));}}(b,e,f))},a,b)}
function Zl(a,b,c,d,e,f,g,h){var k=Yd.c(Xk,a,c),m=new V(null,2,5,X,[770,771],null),n=new v(null,4,[xj,0,Sg,0,hi,g,ek,h],null);f=Yl(Wl,Jc.d(f,kh,new V(null,2,5,X,[g,h],null),N([ah,d,oh,e,Xh,mat4.multiply(a.Qb,e,d)],0)));g=E(b);h=null;for(var p=0,q=0;;)if(q<p){var r=h.v(null,q),s=ad(r)?S.b($d,r):r;b=R.b(s,jh);var u=R.b(s,cj),x=R.b(s,Xg);if(w(x)){var A=ki.a(x),G=ch.a(x),M=Ti.a(x),r=me.b(function(a,b,c,d,e,f,g,h,k,m,n,p,r){return function(a){var b=Q.c(a,0,null),c=Q.c(a,1,null);a=Q.c(a,2,null);return new v(null,
6,[Nj,r.a?r.a(b):r.call(null,b),Mi,a,pi,5126,Uj,f,yh,4*c,ak,g],null)}}(g,h,p,q,A,G,M,r,s,b,u,x,k,m,n,f),Mj.a(x)),u=w(u)?new V(null,1,5,X,[new v(null,2,[Vj,u,Yh,"overlay"],null)],null):null,s=Hf.d(N([new v(null,3,[lh,di.a(b),yh,yh.a(b),Li,nh.a(b)],null),function(){var a=Rj.a(x);return w(a)?new v(null,1,[oi,a],null):null}()],0)),s=Yl(f,s);gl.d(a,N([Xj,c,fj,0,Kj,n,Ej,0,ii,new V(null,1,5,X,[m],null),bj,A,wj,u,$g,new hf([2929,!0]),Mj,r,Ch,Gf(s)],0))}w(!1)&&(u=wh.a(b),w(u)&&gl.d(a,N([Xj,Xj.a(u),fj,1,Kj,
n,Ej,0,bj,24,$g,new hf([2929,!1]),Ch,new V(null,3,5,X,[new v(null,3,[Yh,"m",pi,ij,Vi,di.a(b)],null),new v(null,3,[Yh,"v",pi,ij,Vi,e],null),new v(null,3,[Yh,"p",pi,ij,Vi,d],null)],null),Mj,new V(null,1,5,X,[new v(null,6,[Nj,Hi.a(u),Mi,3,pi,5126,Uj,12,yh,0,ak,ak.a(u)],null)],null)],0)));q+=1}else if(s=E(g)){A=s;if(Wc(A))g=Rb(A),h=Sb(A),b=g,p=O(g),g=h,h=b;else{G=H(A);M=ad(G)?S.b($d,G):G;b=R.b(M,jh);u=R.b(M,cj);x=R.b(M,Xg);if(w(x)){var r=ki.a(x),P=ch.a(x),ja=Ti.a(x);g=me.b(function(a,b,c,d,e,f,g,h,k,
m,n,p,r,q,s){return function(a){var b=Q.c(a,0,null),c=Q.c(a,1,null);a=Q.c(a,2,null);return new v(null,6,[Nj,s.a?s.a(b):s.call(null,b),Mi,a,pi,5126,Uj,f,yh,4*c,ak,g],null)}}(g,h,p,q,r,P,ja,G,M,b,u,x,A,s,k,m,n,f),Mj.a(x));h=w(u)?new V(null,1,5,X,[new v(null,2,[Vj,u,Yh,"overlay"],null)],null):null;p=Hf.d(N([new v(null,3,[lh,di.a(b),yh,yh.a(b),Li,nh.a(b)],null),function(){var a=Rj.a(x);return w(a)?new v(null,1,[oi,a],null):null}()],0));p=Yl(f,p);gl.d(a,N([Xj,c,fj,0,Kj,n,Ej,0,ii,new V(null,1,5,X,[m],null),
bj,r,wj,h,$g,new hf([2929,!0]),Mj,g,Ch,Gf(p)],0))}w(!1)&&(g=wh.a(b),w(g)&&gl.d(a,N([Xj,Xj.a(g),fj,1,Kj,n,Ej,0,bj,24,$g,new hf([2929,!1]),Ch,new V(null,3,5,X,[new v(null,3,[Yh,"m",pi,ij,Vi,di.a(b)],null),new v(null,3,[Yh,"v",pi,ij,Vi,e],null),new v(null,3,[Yh,"p",pi,ij,Vi,d],null)],null),Mj,new V(null,1,5,X,[new v(null,6,[Nj,Hi.a(g),Mi,3,pi,5126,Uj,12,yh,0,ak,ak.a(g)],null)],null)],0)));g=J(A);h=null;p=0}q=0}else break}
function $l(a,b,c,d,e,f,g,h){var k=ad(b)?S.b($d,b):b;b=R.b(k,jh);var m=R.b(k,Xg),k=new V(null,1,5,X,[new v(null,6,[ak,Ti.a(m),Nj,a.getAttribLocation(c,"position"),Mi,3,pi,5126,Uj,ch.a(m),yh,0],null)],null),n=new V(null,2,5,X,[1,0],null);g=new v(null,4,[xj,0,Sg,0,hi,g,ek,h],null);h=ki.a(m);d=Yl(Xl,Jc.d(f,yh,yh.a(b),N([lh,di.a(b),ah,d,oh,e,Xh,mat4.multiply(a.Qb,e,d)],0)));gl.d(a,N([Xj,c,fj,0,Ej,0,Kj,g,ii,new V(null,1,5,X,[n],null),bj,h,$g,new hf([2929,!0]),Mj,k,Ch,Gf(d)],0))}
function am(a){a=ad(a)?S.b($d,a):a;a=R.b(a,kj);return new V(null,2,5,X,[a.canvas.width,a.canvas.height],null)}function bm(a){var b=1/vec3.length(a);return[a[0]*b,a[1]*b,a[2]*b,a[3]*b]}
function cm(a,b){var c=mat4.invert(mat4.create,b),d=mat4.multiply(mat4.create,a,c),e=function(a,b){return function(a,c,d){c=b[c];d=b[d];return a.b?a.b(c,d):a.call(null,c,d)}}(c,d);return ge.b(bm,new V(null,6,5,X,[function(){var a=e(id,3,0),b=e(id,7,4),c=e(id,11,8),d=e(id,15,12);return[a,b,c,d]}(),function(){var a=e(jd,3,0),b=e(jd,7,4),c=e(jd,11,8),d=e(jd,15,12);return[a,b,c,d]}(),function(){var a=e(id,3,1),b=e(id,7,5),c=e(id,11,9),d=e(id,15,13);return[a,b,c,d]}(),function(){var a=e(jd,3,1),b=e(jd,
7,5),c=e(jd,11,9),d=e(jd,15,13);return[a,b,c,d]}(),function(){var a=e(id,3,2),b=e(id,7,6),c=e(id,11,10),d=e(id,15,14);return[a,b,c,d]}(),function(){var a=e(jd,3,2),b=e(jd,7,6),c=e(jd,11,10),d=e(jd,15,14);return[a,b,c,d]}()],null))}
function dm(a){var b=ad(a)?S.b($d,a):a,c=R.b(b,$h),d=kj.a(b),e=gi.a(b),f=am(b),g=Q.c(f,0,null),h=Q.c(f,1,null),k=H(je.b(Si,oe.b(c,new V(null,2,5,X,[ck,Pj],null)))),m=ck.a(c),n=pj.a(c),p=function(){var a=Zh.a(m);return w(a)?a:new V(null,3,5,X,[0,0,0],null)}(),q=function(){var a=Dj.a(m);return w(a)?a:new V(null,3,5,X,[0,0,0],null)}(),r=Pl(d,k,g,h),s=Rl(d,p,q),u=mat4.multiply(d.Qb,s,r),x=cm(r,s),A=ji.a(n);S.c(al,d,Md.b(vh.a(n),new V(null,1,5,X,[1],null)));bl(d);a=ke.b(function(){return function(a){return null==
a}}(d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,a,b,b,c),ge.b(function(a,b){return function(a){return Ll.b(b,a)}}(d,e,f,g,h,k,m,n,p,q,r,s,u,x,A,a,b,b,c),ge.b(hh,Gf(vi.a(b)))));cg.d(N([O(a),"/",O(vi.a(b))],0));Zl(d,a,Xj.a(b),r,s,A,g,h);g=E(Vg.a(b));h=null;for(a=A=0;;)if(a<A)b=h.v(null,a),c=d,e=u,f=s,k=r,b.i?b.i(c,e,f,k):b.call(null,c,e,f,k),a+=1;else if(b=E(g))g=b,Wc(g)?(h=Rb(g),g=Sb(g),b=h,A=O(h),h=b):(b=H(g),h=d,A=u,a=s,c=r,b.i?b.i(h,A,a,c):b.call(null,h,A,a,c),g=J(g),h=null,A=0),a=0;else return null}
function em(a,b){for(var c=E(b),d=null,e=0,f=0;;)if(f<e){var g=d.v(null,f);a.deleteFramebuffer(jj.a(g));a.deleteRenderbuffer(zh.a(g));a.deleteTexture(Xi.a(g));f+=1}else if(c=E(c))d=c,Wc(d)?(c=Rb(d),e=Sb(d),d=c,g=O(c),c=e,e=g):(g=H(d),a.deleteFramebuffer(jj.a(g)),a.deleteRenderbuffer(zh.a(g)),a.deleteTexture(Xi.a(g)),c=J(d),d=null,e=0),f=0;else break}
function fm(a,b,c){var d=a.createFramebuffer(),e=a.createTexture(),f=a.createRenderbuffer();a.bindFramebuffer(36160,d);d.width=b;d.height=c;a.bindTexture(3553,e);a.texParameteri(3553,10240,9728);a.texParameteri(3553,10241,9728);a.texParameteri(3553,10242,33071);a.texParameteri(3553,10243,33071);a.texImage2D(3553,0,6408,b,c,0,6408,5121,null);a.bindRenderbuffer(36161,f);a.renderbufferStorage(36161,33189,b,c);a.framebufferTexture2D(36160,36064,3553,e,0);a.framebufferRenderbuffer(36160,36096,36161,f);
a.bindTexture(3553,null);a.bindRenderbuffer(36161,null);a.bindFramebuffer(36160,null);return new v(null,3,[jj,d,Xi,e,aj,f],null)}function gm(a,b,c){return new v(null,3,[xj,fm(a,b,c),Sg,fm(a,b,c),Ii,fm(a,b,c)],null)}
function hm(a,b,c,d){var e=ad(a)?S.b($d,a):a,f=R.b(e,$h);a=kj.a(e);var g=gi.a(e),h=am(e),k=Q.c(h,0,null),h=Q.c(h,1,null),m=H(je.b(Si,oe.b(f,new V(null,2,5,X,[ck,Pj],null)))),n=ck.a(f),p=pj.a(f),f=function(){var a=Zh.a(n);return w(a)?a:new V(null,3,5,X,[0,0,0],null)}(),q=function(){var a=Dj.a(n);return w(a)?a:new V(null,3,5,X,[0,0,0],null)}(),m=Pl(a,m,k,h),f=Rl(a,f,q);d=Jc.d(If(ji.a(p),new V(null,3,5,X,[Th,yj,yh],null)),oi,20,N([Ni,d],0));a.bindFramebuffer(36160,jj.a(c));al(a,0,0,0,0);bl(a);c=E(Gf(vi.a(e)));
e=null;for(q=p=0;;)if(q<p){var r=e.v(null,q),r=ad(r)?S.b($d,r):r,r=R.b(r,hh),r=Ll.b(g,r);w(r)&&$l(a,r,b,m,f,d,k,h);q+=1}else if(c=E(c))Wc(c)?(p=Rb(c),c=Sb(c),e=p,p=O(p)):(e=H(c),e=ad(e)?S.b($d,e):e,e=R.b(e,hh),e=Ll.b(g,e),w(e)&&$l(a,e,b,m,f,d,k,h),c=J(c),e=null,p=0),q=0;else break;a.bindFramebuffer(36160,null)}function im(a,b,c,d){var e=new Uint8Array(4);a.bindFramebuffer(36160,jj.a(b));a.readPixels(c,d,1,1,6408,5121,e);a.bindFramebuffer(36160,null);return(new Float32Array(e.buffer))[0]}
function jm(a,b,c,d){if(a?a.Hc:a)return a.Hc(0,b,c,d);var e;e=jm[t(null==a?null:a)];if(!e&&(e=jm._,!e))throw z("IPointPicker.pick-point",a);return e.call(null,a,b,c,d)}function km(a,b,c,d){this.ia=a;this.u=b;this.r=c;this.n=d;this.j=2229667594;this.q=8192}l=km.prototype;l.J=function(a,b){return fb.c(this,b,null)};l.I=function(a,b,c){switch(b instanceof T?b.qa:null){case "picker-state":return this.ia;default:return R.c(this.r,b,c)}};
l.w=function(a,b,c){return Vf(b,function(){return function(a){return Vf(b,ag,""," ","",c,a)}}(this),"#renderer.engine.render.PointPicker{",", ","}",c,Md.b(new V(null,1,5,X,[new V(null,2,5,X,[Ri,this.ia],null)],null),this.r))};l.A=function(){return this.u};l.O=function(){return 1+O(this.r)};l.D=function(){var a=this.n;return null!=a?a:this.n=a=nd(this)};l.C=function(a,b){return w(w(b)?this.constructor===b.constructor&&$e(this,b):b)?!0:!1};
l.La=function(a,b){return cd(new Kf(null,new v(null,1,[Ri,null],null),null),b)?Kc.b(Nc(le.b(Y,this),this.u),b):new km(this.ia,this.u,Td(Kc.b(this.r,b)),null)};l.Ea=function(a,b,c){return w(vd.b?vd.b(Ri,b):vd.call(null,Ri,b))?new km(c,this.u,this.r,null):new km(this.ia,this.u,Jc.c(this.r,b,c),null)};l.M=function(){return E(Md.b(new V(null,1,5,X,[new V(null,2,5,X,[Ri,this.ia],null)],null),this.r))};
l.Hc=function(a,b,c,d){var e=this;b=ad(b)?S.b($d,b):b;R.b(b,$h);cg.d(N(["picking point:",c,d],0));a=kj.a(b);var f=am(b),g=Q.c(f,0,null),f=Q.c(f,1,null);if(!w(Xj.a(function(){var a=e.ia;return K.a?K.a(a):K.call(null,a)}()))){var h=nl(a);ee.i(e.ia,Jc,Xj,h)}if(Sd.b(g,hi.a(function(){var a=e.ia;return K.a?K.a(a):K.call(null,a)}()))||Sd.b(f,ek.a(function(){var a=e.ia;return K.a?K.a(a):K.call(null,a)}())))em(a,If(function(){var a=e.ia;return K.a?K.a(a):K.call(null,a)}(),new V(null,3,5,X,[xj,Sg,Ii],null))),
h=gm(a,g,f),ee.d(e.ia,Jc,hi,g,N([ek,f,xj,xj.a(h),Sg,Sg.a(h),Ii,Ii.a(h)],0));g=Xj.a(function(){var a=e.ia;return K.a?K.a(a):K.call(null,a)}());hm(b,g,xj.a(function(){var a=e.ia;return K.a?K.a(a):K.call(null,a)}()),new V(null,3,5,X,[1,0,0],null));hm(b,g,Sg.a(function(){var a=e.ia;return K.a?K.a(a):K.call(null,a)}()),new V(null,3,5,X,[0,1,0],null));hm(b,g,Ii.a(function(){var a=e.ia;return K.a?K.a(a):K.call(null,a)}()),new V(null,3,5,X,[0,0,1],null));d=f-d;return new V(null,3,5,X,[im(a,xj.a(function(){var a=
e.ia;return K.a?K.a(a):K.call(null,a)}()),c,d),im(a,Sg.a(function(){var a=e.ia;return K.a?K.a(a):K.call(null,a)}()),c,d),im(a,Ii.a(function(){var a=e.ia;return K.a?K.a(a):K.call(null,a)}()),c,d)],null)};l.F=function(a,b){return new km(this.ia,b,this.r,this.n)};l.N=function(a,b){return Vc(b)?hb(this,C.b(b,0),C.b(b,1)):Pa.c(Wa,this,b)};function lm(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function mm(a,b,c,d){this.head=a;this.B=b;this.length=c;this.e=d}mm.prototype.pop=function(){if(0===this.length)return null;var a=this.e[this.B];this.e[this.B]=null;this.B=(this.B+1)%this.e.length;this.length-=1;return a};mm.prototype.unshift=function(a){this.e[this.head]=a;this.head=(this.head+1)%this.e.length;this.length+=1;return null};function nm(a,b){a.length+1===a.e.length&&a.resize();a.unshift(b)}
mm.prototype.resize=function(){var a=Array(2*this.e.length);return this.B<this.head?(lm(this.e,this.B,a,0,this.length),this.B=0,this.head=this.length,this.e=a):this.B>this.head?(lm(this.e,this.B,a,0,this.e.length-this.B),lm(this.e,0,a,this.e.length-this.B,this.head),this.B=0,this.head=this.length,this.e=a):this.B===this.head?(this.head=this.B=0,this.e=a):null};function om(a,b){for(var c=a.length,d=0;;)if(d<c){var e=a.pop(),f;f=e;f=b.a?b.a(f):b.call(null,f);w(f)&&a.unshift(e);d+=1}else break}
function pm(a){if(!(0<a))throw Error([B("Assert failed: "),B("Can't create a ring buffer of size 0"),B("\n"),B(de.d(N([sd(new lc(null,"\x3e","\x3e",1085014381,null),new lc(null,"n","n",-2092305744,null),0)],0)))].join(""));return new mm(0,0,0,Array(a))}function qm(a,b){this.H=a;this.kd=b;this.q=0;this.j=2}qm.prototype.O=function(){return this.H.length};function rm(a){return a.H.length===a.kd}qm.prototype.vb=function(){return this.H.pop()};qm.prototype.ac=function(a,b){nm(this.H,b);return this};
function sm(a){return new qm(pm(a),a)};var tm=pm(32),um=!1,vm=!1;function wm(){um=!0;vm=!1;for(var a=0;;){var b=tm.pop();if(null!=b&&(b.m?b.m():b.call(null),1024>a)){a+=1;continue}break}um=!1;return 0<tm.length?xm.m?xm.m():xm.call(null):null}function xm(){var a=vm;if(w(w(a)?um:a))return null;vm=!0;"function"==t(aa.setImmediate)?aa.setImmediate(wm):(Uk||(Uk=Vk()),Uk(wm))}function ym(a){nm(tm,a);xm()};var zm,Bm=function Am(b){"undefined"===typeof zm&&(zm=function(b,d,e){this.T=b;this.Kc=d;this.hd=e;this.q=0;this.j=425984},zm.prototype.Wa=function(){return this.T},zm.prototype.A=function(){return this.hd},zm.prototype.F=function(b,d){return new zm(this.T,this.Kc,d)},zm.Za=!0,zm.Ya="cljs.core.async.impl.channels/t26292",zm.lb=function(b,d){return Fb(d,"cljs.core.async.impl.channels/t26292")});return new zm(b,Am,Y)};function Cm(a,b){this.nb=a;this.T=b}function Dm(a){return Ik(a.nb)}
function Em(a){if(a?a.$b:a)return a.$b();var b;b=Em[t(null==a?null:a)];if(!b&&(b=Em._,!b))throw z("MMC.abort",a);return b.call(null,a)}function Fm(a,b,c,d,e,f,g){this.Ua=a;this.zb=b;this.Oa=c;this.yb=d;this.H=e;this.closed=f;this.ya=g}
Fm.prototype.wb=function(){var a=this;if(!a.closed){a.closed=!0;if(w(function(){var b=a.H;return w(b)?0===a.Oa.length:b}())){var b=a.H;a.ya.a?a.ya.a(b):a.ya.call(null,b)}for(;b=a.Ua.pop(),null!=b;)if(b.ua(null)){var c=b.pa(null),d=w(function(){var b=a.H;return w(b)?0<O(a.H):b}())?a.H.vb():null;ym(function(a,b){return function(){return a.a?a.a(b):a.call(null,b)}}(c,d,b,this))}}return null};
Fm.prototype.Nb=function(a,b){var c=this;if(b.ua(null)){if(null!=c.H&&0<O(c.H)){for(var d=b.pa(null),e=Bm(c.H.vb());;){if(!w(rm(c.H))){var f=c.Oa.pop();if(null!=f){var g=f.nb,h=f.T;if(g.ua(null)){var k=g.pa(null);b.pa(null);ym(function(a){return function(){return a.a?a.a(!0):a.call(null,!0)}}(k,g,h,f,d,e,this));xc(function(){var a=c.H,b=h;return c.ya.b?c.ya.b(a,b):c.ya.call(null,a,b)}())&&Em(this)}continue}}break}return e}d=function(){for(;;){var a=c.Oa.pop();if(w(a)){if(Ik(a.nb))return a}else return null}}();
if(w(d))return e=Jk(d.nb),b.pa(null),ym(function(a){return function(){return a.a?a.a(!0):a.call(null,!0)}}(e,d,this)),Bm(d.T);if(w(c.closed))return w(c.H)&&(d=c.H,c.ya.a?c.ya.a(d):c.ya.call(null,d)),w(function(){var a=b.ua(null);return w(a)?b.pa(null):a}())?(d=function(){var a=c.H;return w(a)?0<O(c.H):a}(),d=w(d)?c.H.vb():null,Bm(d)):null;64<c.zb?(c.zb=0,om(c.Ua,Ik)):c.zb+=1;if(!(1024>c.Ua.length))throw Error([B("Assert failed: "),B([B("No more than "),B(1024),B(" pending takes are allowed on a single channel.")].join("")),
B("\n"),B(de.d(N([sd(new lc(null,"\x3c","\x3c",993667236,null),sd(new lc(null,".-length",".-length",-280799999,null),new lc(null,"takes","takes",298247964,null)),new lc("impl","MAX-QUEUE-SIZE","impl/MAX-QUEUE-SIZE",1508600732,null))],0)))].join(""));nm(c.Ua,b)}return null};
Fm.prototype.xb=function(a,b,c){var d=this;if(null==b)throw Error([B("Assert failed: "),B("Can't put nil in on a channel"),B("\n"),B(de.d(N([sd(new lc(null,"not","not",1044554643,null),sd(new lc(null,"nil?","nil?",1612038930,null),new lc(null,"val","val",1769233139,null)))],0)))].join(""));if((a=d.closed)||!c.ua(null))return Bm(!a);if(w(function(){var a=d.H;return w(a)?Ja(rm(d.H)):a}())){c.pa(null);for(c=xc(function(){var a=d.H;return d.ya.b?d.ya.b(a,b):d.ya.call(null,a,b)}());;){if(0<d.Ua.length&&
0<O(d.H)){var e=d.Ua.pop();if(e.ua(null)){var f=e.pa(null),g=d.H.vb();ym(function(a,b){return function(){return a.a?a.a(b):a.call(null,b)}}(f,g,e,c,a,this))}else continue}break}c&&Em(this);return Bm(!0)}e=function(){for(;;){var a=d.Ua.pop();if(w(a)){if(w(a.ua(null)))return a}else return null}}();if(w(e))return f=Jk(e),c.pa(null),ym(function(a){return function(){return a.a?a.a(b):a.call(null,b)}}(f,e,a,this)),Bm(!0);64<d.yb?(d.yb=0,om(d.Oa,Dm)):d.yb+=1;if(!(1024>d.Oa.length))throw Error([B("Assert failed: "),
B([B("No more than "),B(1024),B(" pending puts are allowed on a single channel."),B(" Consider using a windowed buffer.")].join("")),B("\n"),B(de.d(N([sd(new lc(null,"\x3c","\x3c",993667236,null),sd(new lc(null,".-length",".-length",-280799999,null),new lc(null,"puts","puts",-1883877054,null)),new lc("impl","MAX-QUEUE-SIZE","impl/MAX-QUEUE-SIZE",1508600732,null))],0)))].join(""));nm(d.Oa,new Cm(c,b));return null};
Fm.prototype.$b=function(){for(;;){var a=this.Oa.pop();if(null!=a){var b=a.nb,c=a.T;if(b.ua(null)){var d=b.pa(null);ym(function(a){return function(){return a.a?a.a(!0):a.call(null,!0)}}(d,b,c,a,this))}else continue}break}om(this.Oa,Xd());return Hk(this)};function Gm(a){console.log(a);return null}function Hm(a,b,c){b=(w(b)?b:Gm).call(null,c);return null==b?a:Lk.b(a,b)}
var Im=function(){function a(a,b,c){return new Fm(pm(32),0,pm(32),0,a,!1,function(){return function(a){return function(){function b(d,e){try{return a.b?a.b(d,e):a.call(null,d,e)}catch(f){return Hm(d,c,f)}}function d(b){try{return a.a?a.a(b):a.call(null,b)}catch(e){return Hm(b,c,e)}}var e=null,e=function(a,c){switch(arguments.length){case 1:return d.call(this,a);case 2:return b.call(this,a,c)}throw Error("Invalid arity: "+arguments.length);};e.a=d;e.b=b;return e}()}(w(b)?b.a?b.a(Lk):b.call(null,Lk):
Lk)}())}function b(a,b){return d.c(a,b,null)}function c(a){return d.b(a,null)}var d=null,d=function(d,f,g){switch(arguments.length){case 1:return c.call(this,d);case 2:return b.call(this,d,f);case 3:return a.call(this,d,f,g)}throw Error("Invalid arity: "+arguments.length);};d.a=c;d.b=b;d.c=a;return d}();function Jm(a,b,c){this.key=a;this.T=b;this.forward=c;this.q=0;this.j=2155872256}Jm.prototype.w=function(a,b,c){return Vf(b,ag,"["," ","]",c,this)};Jm.prototype.M=function(){return Wa(Wa(nc,this.T),this.key)};
(function(){function a(a,b,c){c=Array(c+1);for(var g=0;;)if(g<c.length)c[g]=null,g+=1;else break;return new Jm(a,b,c)}function b(a){return c.c(null,null,a)}var c=null,c=function(c,e,f){switch(arguments.length){case 1:return b.call(this,c);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c})().a(0);var Km=function(){function a(a,b,c){a=oc.b(a,0)?null:a;if(w(b)&&!w(a))throw Error([B("Assert failed: "),B("buffer must be supplied when transducer is"),B("\n"),B(de.d(N([new lc(null,"buf-or-n","buf-or-n",-1646815050,null)],0)))].join(""));return Im.c("number"===typeof a?sm(a):a,b,c)}function b(a,b){return e.c(a,b,null)}function c(a){return e.c(a,null,null)}function d(){return e.a(null)}var e=null,e=function(e,g,h){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,e);case 2:return b.call(this,
e,g);case 3:return a.call(this,e,g,h)}throw Error("Invalid arity: "+arguments.length);};e.m=d;e.a=c;e.b=b;e.c=a;return e}();
(function Lm(b){"undefined"===typeof Ck&&(Ck=function(b,d,e){this.mb=b;this.Pb=d;this.dd=e;this.q=0;this.j=393216},Ck.prototype.ua=function(){return!0},Ck.prototype.pa=function(){return this.mb},Ck.prototype.A=function(){return this.dd},Ck.prototype.F=function(b,d){return new Ck(this.mb,this.Pb,d)},Ck.Za=!0,Ck.Ya="cljs.core.async/t22755",Ck.lb=function(b,d){return Fb(d,"cljs.core.async/t22755")});return new Ck(b,Lm,Y)})(function(){return null});
function Mm(a){for(var b=Array(a),c=0;;)if(c<a)b[c]=0,c+=1;else break;for(c=1;;){if(oc.b(c,a))return b;var d=ng(c);b[c]=b[d];b[d]=c;c+=1}}
var Om=function Nm(){var b=U.a?U.a(!0):U.call(null,!0);"undefined"===typeof Dk&&(Dk=function(b,d,e){this.Sa=b;this.Ic=d;this.ed=e;this.q=0;this.j=393216},Dk.prototype.ua=function(){return function(){var b=this.Sa;return K.a?K.a(b):K.call(null,b)}}(b),Dk.prototype.pa=function(){return function(){var b=this.Sa;ce.b?ce.b(b,null):ce.call(null,b,null);return!0}}(b),Dk.prototype.A=function(){return function(){return this.ed}}(b),Dk.prototype.F=function(){return function(b,d){return new Dk(this.Sa,this.Ic,
d)}}(b),Dk.Za=!0,Dk.Ya="cljs.core.async/t22803",Dk.lb=function(){return function(b,d){return Fb(d,"cljs.core.async/t22803")}}(b));return new Dk(b,Nm,Y)},on=function Pm(b,c){"undefined"===typeof Ek&&(Ek=function(b,c,f,g){this.eb=b;this.Sa=c;this.Jc=f;this.fd=g;this.q=0;this.j=393216},Ek.prototype.ua=function(){return Ik(this.Sa)},Ek.prototype.pa=function(){Jk(this.Sa);return this.eb},Ek.prototype.A=function(){return this.fd},Ek.prototype.F=function(b,c){return new Ek(this.eb,this.Sa,this.Jc,c)},Ek.Za=
!0,Ek.Ya="cljs.core.async/t22814",Ek.lb=function(b,c){return Fb(c,"cljs.core.async/t22814")});return new Ek(c,b,Pm,Y)};
function pn(a,b,c){var d=Om(),e=O(b),f=Mm(e),g=Oi.a(c),h=function(){for(var c=0;;)if(c<e){var h=w(g)?c:f[c],n=Q.b(b,h),p=Vc(n)?n.a?n.a(0):n.call(null,0):null,q=w(p)?function(){var b=n.a?n.a(1):n.call(null,1);return Gk(p,b,on(d,function(b,c,d,e,f){return function(b){b=new V(null,2,5,X,[b,f],null);return a.a?a.a(b):a.call(null,b)}}(c,b,h,n,p,d,e,f,g)))}():Fk(n,on(d,function(b,c,d){return function(b){b=new V(null,2,5,X,[b,d],null);return a.a?a.a(b):a.call(null,b)}}(c,h,n,p,d,e,f,g)));if(w(q))return Bm(new V(null,
2,5,X,[function(){var a=q;return K.a?K.a(a):K.call(null,a)}(),function(){var a=p;return w(a)?a:n}()],null));c+=1}else return null}();return w(h)?h:cd(c,Ph)&&(h=function(){var a=d.ua(null);return w(a)?d.pa(null):a}(),w(h))?Bm(new V(null,2,5,X,[Ph.a(c),Ph],null)):null}
function qn(a,b){var c=Km.a(1);ym(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:{try{for(;;){var e=a(c);if(!vd(e,$)){d=e;break a}}}catch(f){if(f instanceof Object){c[5]=f;Tk(c);d=$;break a}throw f;}d=void 0}if(!vd(d,$))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.m=c;d.a=b;return d}()}(function(){return function(c){var d=c[1];if(7===d)return d=c,d[2]=c[2],d[1]=3,$;if(6===d){var d=c[7],e=c[8],d=Gc.b?Gc.b(d,e):Gc.call(null,d,e);c[7]=d;c[2]=null;c[1]=2;return $}return 5===d?(d=c[7],c[2]=d,c[1]=7,$):4===d?(d=c[2],c[8]=d,c[1]=w(null==d)?5:6,$):3===d?(d=c[2],Sk(c,d)):2===d?Qk(c,4,b):1===d?(d=a,c[7]=d,c[2]=null,c[1]=2,$):null}}(c),c)}(),f=function(){var a=e.m?e.m():e.call(null);a[6]=c;return a}();return Pk(f)}}(c));return c}
var rn=function(){function a(a,b,c){var g=Km.a(1);ym(function(g){return function(){var k=function(){return function(a){return function(){function b(c){for(;;){var d;a:{try{for(;;){var e=a(c);if(!vd(e,$)){d=e;break a}}}catch(f){if(f instanceof Object){c[5]=f;Tk(c);d=$;break a}throw f;}d=void 0}if(!vd(d,$))return d}}function c(){var a=[null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,
a)}throw Error("Invalid arity: "+arguments.length);};d.m=c;d.a=b;return d}()}(function(){return function(g){var h=g[1];return 7===h?(h=g,h[2]=g[2],h[1]=6,$):1===h?(h=E(b),g[7]=h,g[2]=null,g[1]=2,$):4===h?(h=g[7],h=H(h),Rk(g,7,a,h)):13===h?(h=g[2],g[2]=h,g[1]=10,$):6===h?(h=g[2],g[1]=w(h)?8:9,$):3===h?(h=g[2],Sk(g,h)):12===h?(g[2]=null,g[1]=13,$):2===h?(h=g[7],g[1]=w(h)?4:5,$):11===h?(h=Hk(a),g[2]=h,g[1]=13,$):9===h?(g[1]=w(c)?11:12,$):5===h?(h=g[7],g[2]=h,g[1]=6,$):10===h?(h=g[2],g[2]=h,g[1]=3,$):
8===h?(h=g[7],h=J(h),g[7]=h,g[2]=null,g[1]=2,$):null}}(g),g)}(),m=function(){var a=k.m?k.m():k.call(null);a[6]=g;return a}();return Pk(m)}}(g));return g}function b(a,b){return c.c(a,b,!0)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}(),sn=function(){function a(a,d,e,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=
arguments[g+3],++g;g=new F(h,0)}return b.call(this,a,d,e,g)}function b(a,b,e,f){var g=ad(f)?S.b($d,f):f;a[1]=b;b=pn(function(){return function(b){a[2]=b;return Pk(a)}}(f,g,g),e,g);return w(b)?(a[2]=K.a?K.a(b):K.call(null,b),$):null}a.l=3;a.h=function(a){var d=H(a);a=J(a);var e=H(a);a=J(a);var f=H(a);a=I(a);return b(d,e,f,a)};a.d=b;return a}(),tn=function(){function a(a,b){var c=Km.a(b),g=Km.a(1);ym(function(b,c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;
a:{try{for(;;){var e=a(c);if(!vd(e,$)){d=e;break a}}}catch(f){if(f instanceof Object){c[5]=f;Tk(c);d=$;break a}throw f;}d=void 0}if(!vd(d,$))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.m=c;d.a=b;return d}()}(function(b,c){return function(e){var f=e[1];if(7===f){var g=e[7],
h=e[8],k=e[2],m=Q.c(k,0,null),n=Q.c(k,1,null);e[7]=k;e[8]=m;e[9]=n;e[1]=w(null==m)?8:9;return $}if(1===f){var P=Qe(a);e[10]=P;e[2]=null;e[1]=2;return $}return 4===f?(P=e[10],sn(e,7,P)):6===f?(k=e[2],e[2]=k,e[1]=3,$):3===f?(k=e[2],Sk(e,k)):2===f?(P=e[10],k=0<O(P),e[1]=w(k)?4:5,$):11===f?(P=e[10],k=e[2],e[10]=P,e[11]=k,e[2]=null,e[1]=2,$):9===f?(h=e[8],Rk(e,11,c,h)):5===f?(k=Hk(c),e[2]=k,e[1]=6,$):10===f?(k=e[2],e[2]=k,e[1]=6,$):8===f?(P=e[10],g=e[7],h=e[8],n=e[9],k=ne(function(){return function(a){return function(b){return Sd.b(a,
b)}}(n,h,g,P,P,g,h,n,f,b,c)}(),P),e[10]=k,e[2]=null,e[1]=2,$):null}}(b,c),b,c)}(),f=function(){var a=e.m?e.m():e.call(null);a[6]=b;return a}();return Pk(f)}}(g,c));return c}function b(a){return c.b(a,null)}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}();function un(a,b){return qn(a,b)};function vn(a,b){var c=S.c(Pf,a,b);return L(c,ke.b(function(a){return function(b){return a===b}}(c),b))}
var wn=function(){function a(a,b){for(;;)if(O(b)<O(a)){var c=a;a=b;b=c}else return Pa.c(function(a,b){return function(a,c){return cd(b,c)?a:Pc.b(a,c)}}(a,b),a,a)}var b=null,c=function(){function a(b,d,h){var k=null;if(2<arguments.length){for(var k=0,m=Array(arguments.length-2);k<m.length;)m[k]=arguments[k+2],++k;k=new F(m,0)}return c.call(this,b,d,k)}function c(a,d,e){a=vn(function(a){return-O(a)},Gc.d(e,d,N([a],0)));return Pa.c(b,H(a),I(a))}a.l=2;a.h=function(a){var b=H(a);a=J(a);var d=H(a);a=I(a);
return c(b,d,a)};a.d=c;return a}(),b=function(b,e,f){switch(arguments.length){case 1:return b;case 2:return a.call(this,b,e);default:var g=null;if(2<arguments.length){for(var g=0,h=Array(arguments.length-2);g<h.length;)h[g]=arguments[g+2],++g;g=new F(h,0)}return c.d(b,e,g)}throw Error("Invalid arity: "+arguments.length);};b.l=2;b.h=c.h;b.a=function(a){return a};b.b=a;b.d=c.d;return b}(),xn=function(){function a(a,b){return O(a)<O(b)?Pa.c(function(a,c){return cd(b,c)?Pc.b(a,c):a},a,a):Pa.c(Pc,a,b)}
var b=null,c=function(){function a(b,d,h){var k=null;if(2<arguments.length){for(var k=0,m=Array(arguments.length-2);k<m.length;)m[k]=arguments[k+2],++k;k=new F(m,0)}return c.call(this,b,d,k)}function c(a,d,e){return Pa.c(b,a,Gc.b(e,d))}a.l=2;a.h=function(a){var b=H(a);a=J(a);var d=H(a);a=I(a);return c(b,d,a)};a.d=c;return a}(),b=function(b,e,f){switch(arguments.length){case 1:return b;case 2:return a.call(this,b,e);default:var g=null;if(2<arguments.length){for(var g=0,h=Array(arguments.length-2);g<
h.length;)h[g]=arguments[g+2],++g;g=new F(h,0)}return c.d(b,e,g)}throw Error("Invalid arity: "+arguments.length);};b.l=2;b.h=c.h;b.a=function(a){return a};b.b=a;b.d=c.d;return b}();function yn(a,b,c){if(a?a.zc:a)return a.zc(0,b,c);var d;d=yn[t(null==a?null:a)];if(!d&&(d=yn._,!d))throw z("ICursor.transact!",a);return d.call(null,a,b,c)}function zn(a,b){if(a?a.yc:a)return a.yc(0,b);var c;c=zn[t(null==a?null:a)];if(!c&&(c=zn._,!c))throw z("ICursor.sub-cursor",a);return c.call(null,a,b)}
var An=function(){function a(a,b){if(a?a.xc:a)return a.xc(0,b);var c;c=An[t(null==a?null:a)];if(!c&&(c=An._,!c))throw z("ICursor.source-state",a);return c.call(null,a,b)}function b(a){if(a?a.nd:a)return a.Aa;var b;b=An[t(null==a?null:a)];if(!b&&(b=An._,!b))throw z("ICursor.source-state",a);return b.call(null,a)}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}();
function Bn(a,b){if(a?a.wc:a)return a.wc(0,b);var c;c=Bn[t(null==a?null:a)];if(!c&&(c=Bn._,!c))throw z("ICursor.root",a);return c.call(null,a,b)}function Cn(a,b,c,d,e,f){this.Da=a;this.va=b;this.Aa=c;this.u=d;this.r=e;this.n=f;this.j=2229667594;this.q=8192}l=Cn.prototype;l.toString=function(){return[B("\x3cStateCursor "),B(this.va),B("\x3e")].join("")};l.J=function(a,b){return fb.c(this,b,null)};
l.I=function(a,b,c){switch(b instanceof T?b.qa:null){case "sstate":return this.Aa;case "ks":return this.va;case "root-state":return this.Da;default:return R.c(this.r,b,c)}};l.w=function(a,b,c){return Vf(b,function(){return function(a){return Vf(b,ag,""," ","",c,a)}}(this),"#renderer.engine.StateCursor{",", ","}",c,Md.b(new V(null,3,5,X,[new V(null,2,5,X,[fh,this.Da],null),new V(null,2,5,X,[xh,this.va],null),new V(null,2,5,X,[fk,this.Aa],null)],null),this.r))};
l.zc=function(a,b,c){return ee.i(this.Da,re,sl(this.va,b),function(a){return function(b){var f=c.a?c.a(b):c.call(null,b),g=""+B(a);jl.t?jl.t("Transact!",g,": ",b,"-\x3e",f):jl.call(null,"Transact!",g,": ",b,"-\x3e",f);return f}}(this))};l.yc=function(a,b){var c=""+B(this),d=this.va,e=sl(this.va,b);jl.R?jl.R("Sub-cursor",c,": ",d,"-\x3e",b,":",e):jl.call(null,"Sub-cursor",c,": ",d,"-\x3e",b,":",e);return new Cn(this.Da,sl(this.va,b),this.Aa,null,null,null)};
l.wc=function(a,b){var c=this;return oe.b(function(){var a=c.Da;return K.a?K.a(a):K.call(null,a)}(),rl(b))};l.nd=function(){return this.Aa};l.xc=function(a,b){return oe.b(this.Aa,rl(b))};l.A=function(){return this.u};l.O=function(){return 3+O(this.r)};l.D=function(){var a=this.n;return null!=a?a:this.n=a=nd(this)};l.C=function(a,b){return w(w(b)?this.constructor===b.constructor&&$e(this,b):b)?!0:!1};
l.La=function(a,b){return cd(new Kf(null,new v(null,3,[fh,null,xh,null,fk,null],null),null),b)?Kc.b(Nc(le.b(Y,this),this.u),b):new Cn(this.Da,this.va,this.Aa,this.u,Td(Kc.b(this.r,b)),null)};
l.Ea=function(a,b,c){return w(vd.b?vd.b(fh,b):vd.call(null,fh,b))?new Cn(c,this.va,this.Aa,this.u,this.r,null):w(vd.b?vd.b(xh,b):vd.call(null,xh,b))?new Cn(this.Da,c,this.Aa,this.u,this.r,null):w(vd.b?vd.b(fk,b):vd.call(null,fk,b))?new Cn(this.Da,this.va,c,this.u,this.r,null):new Cn(this.Da,this.va,this.Aa,this.u,Jc.c(this.r,b,c),null)};
l.M=function(){return E(Md.b(new V(null,3,5,X,[new V(null,2,5,X,[fh,this.Da],null),new V(null,2,5,X,[xh,this.va],null),new V(null,2,5,X,[fk,this.Aa],null)],null),this.r))};l.F=function(a,b){return new Cn(this.Da,this.va,this.Aa,b,this.r,this.n)};l.N=function(a,b){return Vc(b)?hb(this,C.b(b,0),C.b(b,1)):Pa.c(Wa,this,b)};function Dn(a,b,c){if(a?a.Cc:a)return a.Cc(0,b,c);var d;d=Dn[t(null==a?null:a)];if(!d&&(d=Dn._,!d))throw z("IRenderEngine.pick-point",a);return d.call(null,a,b,c)}
function En(a,b){if(a?a.Ac:a)return a.Ac(0,b);var c;c=En[t(null==a?null:a)];if(!c&&(c=En._,!c))throw z("IRenderEngine.add-loader",a);return c.call(null,a,b)}function Fn(a,b,c){if(a?a.Dc:a)return a.Dc(0,b,c);var d;d=Fn[t(null==a?null:a)];if(!d&&(d=Fn._,!d))throw z("IRenderEngine.resize-view!",a);return d.call(null,a,b,c)}function Gn(a,b){if(a?a.Bc:a)return a.Bc(0,b);var c;c=Gn[t(null==a?null:a)];if(!c&&(c=Gn._,!c))throw z("IRenderEngine.add-post-render",a);return c.call(null,a,b)}
var Hn=function(){function a(a,b,c){a=Of(ge.b(c,a));var g=Of(df(b));b=xn.b(a,g);c=xn.b(g,a);a=wn.b(a,g);return new V(null,3,5,X,[le.b(Fc,b),le.b(Fc,c),le.b(Fc,a)],null)}function b(a,b){return c.c(a,b,gd)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}(),In=function(){function a(a,b,c,g,h,k){var m=Hn.c(a,b,k),n=Q.c(m,0,null),p=Q.c(m,1,null),q=Q.c(m,2,null),r=
le.b(Y,function(){return function(a,b,c,d){return function W(e){return new zd(null,function(){return function(){for(;;){var a=E(e);if(a){if(Wc(a)){var b=Rb(a),c=O(b),d=Dd(c);return function(){for(var a=0;;)if(a<c){var e=C.b(b,a),f=d,g=X,h;h=e;h=k.a?k.a(h):k.call(null,h);f.add(new V(null,2,5,g,[h,e],null));a+=1}else return!0}()?Gd(d.P(),W(Sb(a))):Gd(d.P(),null)}var f=H(a);return L(new V(null,2,5,X,[function(){var a=f;return k.a?k.a(a):k.call(null,a)}(),f],null),W(I(a)))}return null}}}(a,b,c,d),null,
null)}}(m,n,p,q)(a)}()),s=If(r,n),u=If(b,p),x=Gf(u);Uf.a(ge.b(g,x));var A=le.b(Y,function(){return function(a,b,d,e,g,h,k){return function ca(m){return new zd(null,function(){return function(){for(;;){var a=E(m);if(a){if(Wc(a)){var b=Rb(a),d=O(b),e=Dd(d);return function(){for(var a=0;;)if(a<d){var g=C.b(b,a),h=Q.c(g,0,null),k=Q.c(g,1,null),g=e,m=X,k=c.a?c.a(k):c.call(null,k);g.add(new V(null,2,5,m,[h,k],null));a+=1}else return!0}()?Gd(e.P(),ca(Sb(a))):Gd(e.P(),null)}var g=H(a),h=Q.c(g,0,null),k=Q.c(g,
1,null);return L(new V(null,2,5,X,[h,function(){var a=k;return c.a?c.a(a):c.call(null,a)}()],null),ca(I(a)))}return null}}}(a,b,d,e,g,h,k),null,null)}}(m,n,p,q,r,s,u)(s)}()),G=S.c(Kc,b,p);return Hf.d(N([le.b(Y,function(){return function(a,b,c,d,e,f,g,k,m){return function ga(n){return new zd(null,function(){return function(){for(;;){var a=E(n);if(a){if(Wc(a)){var b=Rb(a),c=O(b),d=Dd(c);return function(){for(var a=0;;)if(a<c){var e=C.b(b,a),f=Q.c(e,0,null),g=Q.c(e,1,null),e=d,k=X,g=h.a?h.a(g):h.call(null,
g);e.add(new V(null,2,5,k,[f,g],null));a+=1}else return!0}()?Gd(d.P(),ga(Sb(a))):Gd(d.P(),null)}var e=H(a),f=Q.c(e,0,null),g=Q.c(e,1,null);return L(new V(null,2,5,X,[f,function(){var a=g;return h.a?h.a(a):h.call(null,a)}()],null),ga(I(a)))}return null}}}(a,b,c,d,e,f,g,k,m),null,null)}}(A,G,m,n,p,q,r,s,u)(G)}()),A],0))}function b(a,b,f,g,h){return c.t(a,b,f,g,gd,h)}var c=null,c=function(c,e,f,g,h,k){switch(arguments.length){case 5:return b.call(this,c,e,f,g,h);case 6:return a.call(this,c,e,f,g,h,k)}throw Error("Invalid arity: "+
arguments.length);};c.s=b;c.t=a;return c}();function Jn(a,b){var c=Km.m();a.load(b,function(a){return function(b,c){return w(b)?Hk(a):rn.b(a,new V(null,1,5,X,[c],null))}}(c));return c}
function Kn(a,b){var c=Km.a(1);ym(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:{try{for(;;){var e=a(c);if(!vd(e,$)){d=e;break a}}}catch(f){if(f instanceof Object){c[5]=f;Tk(c);d=$;break a}throw f;}d=void 0}if(!vd(d,$))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.m=c;d.a=b;return d}()}(function(){return function(c){var d=c[1];if(2===d){var d=c[7],e=c[8];return Sk(c,new V(null,2,5,d,[e,c[2]],null))}if(1===d){var d=X,e=yd.a(a.provides),f=Jn(a,b);c[7]=d;c[8]=e;return Qk(c,2,f)}return null}}(c),c)}(),f=function(){var a=e.m?e.m():e.call(null);a[6]=c;return a}();return Pk(f)}}(c));return c}
function Ln(a,b){var c=Object.keys(b),d=function(){return function(c){return function g(d){return new zd(null,function(){return function(){for(var c=d;;)if(c=E(c)){if(Wc(c)){var e=Rb(c),n=O(e),p=Dd(n);a:{for(var q=0;;)if(q<n){var r=C.b(e,q),s=R.b(a,r);w(s)&&(r=Kn(s,b[r]),p.add(r));q+=1}else{e=!0;break a}e=void 0}return e?Gd(p.P(),g(Sb(c))):Gd(p.P(),null)}p=H(c);e=R.b(a,p);if(w(e))return L(Kn(e,b[p]),g(I(c)));c=I(c)}else return null}}(c),null,null)}}(c)(c)}();return un(Y,tn.a(d))}
function Mn(a,b){var c=Bn(a,kj),d=Bn(a,gi),e=Bn(a,Lj);return yn(a,Fc,function(c,d,e){return function(k){return In.s(b,k,function(b,c,d){return function(e){var f=Bk(e),g=Km.a(1);ym(function(b,c,d,f,g){return function(){var h=function(){return function(a){return function(){function b(c){for(;;){var d;a:{try{for(;;){var e=a(c);if(!vd(e,$)){d=e;break a}}}catch(f){if(f instanceof Object){c[5]=f;Tk(c);d=$;break a}throw f;}d=void 0}if(!vd(d,$))return d}}function c(){var a=[null,null,null,null,null,null,
null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.m=c;d.a=b;return d}()}(function(b,c,d,f,g){return function(h){var k=h[1];if(2===k){var m=h[2],n=[e],p=new V(null,1,5,X,n,null),r=yn(a,p,function(){return function(a,b,c,d,e,f,g,h,k,m){return function(b){if(null==b)return null;var c=Kl(m,k,a);return Jc.c(b,hh,c)}}(m,m,X,n,p,k,b,c,d,f,g)}());return Sk(h,r)}return 1===
k?(r=Ln(g,c),Qk(h,2,r)):null}}(b,c,d,f,g),b,c,d,f,g)}(),k=function(){var a=h.m?h.m():h.call(null);a[6]=b;return a}();return Pk(k)}}(g,f,b,c,d));return new v(null,1,[Gj,!0],null)}}(c,d,e),gd,gd)}}(c,d,e))}function Nn(a,b){var c=document.createElement("canvas");c.width=a;c.height=b;return c}function On(a,b,c){a.width=b;a.height=c}function Pn(a,b,c,d){this.state=a;this.u=b;this.r=c;this.n=d;this.j=2229667594;this.q=8192}l=Pn.prototype;l.J=function(a,b){return fb.c(this,b,null)};
l.I=function(a,b,c){switch(b instanceof T?b.qa:null){case "state":return this.state;default:return R.c(this.r,b,c)}};l.w=function(a,b,c){return Vf(b,function(){return function(a){return Vf(b,ag,""," ","",c,a)}}(this),"#renderer.engine.WebGLRenderEngine{",", ","}",c,Md.b(new V(null,1,5,X,[new V(null,2,5,X,[ui,this.state],null)],null),this.r))};l.A=function(){return this.u};l.O=function(){return 1+O(this.r)};l.D=function(){var a=this.n;return null!=a?a:this.n=a=nd(this)};
l.C=function(a,b){return w(w(b)?this.constructor===b.constructor&&$e(this,b):b)?!0:!1};
function Qn(a,b,c){var d=b.offsetWidth,e=b.offsetHeight,f=Nn(d,e),g=Sl(f);b.appendChild(f);var h=function(){var a=new Ml(U.a?U.a(Y):U.call(null,Y),null,null,null),c=Y,f=Y,h;h=Yk(g,35633,"\n  precision mediump float;\n\n  uniform mat4  projectionMatrix;\n  uniform mat4  modelViewMatrix;\n  uniform mat4  modelViewProjectionMatrix;\n  uniform mat4  modelMatrix;\n\n  uniform float pointSize;\n  uniform float intensityBlend;\n  uniform float maxColorComponent;\n\n  uniform float rgb_f;\n  uniform float intensity_f;\n  uniform float class_f;\n  uniform float height_f;\n  uniform float iheight_f;\n  uniform float map_f;\n  uniform float imap_f;\n  uniform float overlay_f;\n\n  uniform vec3 xyzScale;\n\n  uniform float clampLower;\n  uniform float clampHigher;\n  uniform float colorClampLower;\n  uniform float colorClampHigher;\n  uniform vec2  zrange;\n  uniform vec4  uvrange;\n  uniform vec3  offset;\n  uniform sampler2D map;\n  uniform vec2  klassRange;\n  uniform vec2  pointSizeAttenuation; // (actual size contribution, attenuated size contribution)\n  uniform vec2  screen; // screen dimensions\n\n  uniform sampler2D overlay;\n\n  attribute vec3 position;\n  attribute vec3 color;\n  attribute float intensity;\n  attribute float classification;\n\n  varying vec3 out_color;\n  varying vec3 out_intensity;\n\n  varying vec3 fpos;\n\n\n  void main() {\n      fpos \x3d ((position.xyz - offset) * xyzScale).xzy * vec3(-1, 1, 1);\n\n      vec4 mvPosition \x3d modelViewMatrix * modelMatrix * vec4( fpos, 1.0 );\n      gl_Position \x3d projectionMatrix * mvPosition;\n      float nheight \x3d (position.z - zrange.x) / (zrange.y - zrange.x);\n\n      float nhclamp \x3d (nheight - colorClampLower) / (colorClampHigher - colorClampLower);\n\n      // compute color channels\n      //\n      vec3 norm_color \x3d color / maxColorComponent;\n      vec3 map_color \x3d texture2D(map, vec2(nhclamp, 0.5)).rgb;\n      vec3 inv_map_color \x3d texture2D(map, vec2(1.0 - nhclamp, 0.5)).rgb;\n\n      float iklass \x3d (classification - klassRange.x) / (klassRange.y - klassRange.x);\n      vec3 class_color \x3d texture2D(map, vec2(iklass, 0.5)).rgb;\n\n      // compute intensity channels\n      float i \x3d (intensity - clampLower) / (clampHigher - clampLower);\n      vec3 intensity_color \x3d vec3(i, i, i);\n\n\n      vec3 height_color \x3d vec3(nheight, nheight, nheight);\n      vec3 inv_height_color \x3d vec3(1.0 - nheight, 1.0 - nheight, 1.0 - nheight);\n\n      vec2 uv \x3d vec2(1.0 - (fpos.x - uvrange.x) / (uvrange.z - uvrange.x),\n                     1.0 - (fpos.z - uvrange.y) / (uvrange.w - uvrange.y));\n                     \n      vec3 overlay_color \x3d texture2D(overlay, uv).xyz;\n\n      // turn the appropriate channels on\n      //\n      out_color \x3d norm_color * rgb_f +\n              class_color * class_f +\n              map_color * map_f +\n              inv_map_color * imap_f +\n              overlay_color * overlay_f;\n\n     //out_color \x3d vec3(uv, 0.0);\n              \n      out_intensity \x3d intensity_color * intensity_f +\n                  height_color * height_f +\n                  inv_height_color * iheight_f;\n\n      float attenuatedPointSize \x3d ((1.0 / tan(1.308/2.0)) * pointSize / (-mvPosition.z)) * screen.y / 2.0;\n      gl_PointSize \x3d dot(vec2(pointSize, attenuatedPointSize), pointSizeAttenuation);\n  }");var q=
Yk(g,35632,w(g.getExtension("EXT_frag_depth"))?[B("#define have_frag_depth\n\n"),B("\n#if defined have_frag_depth\n#extension GL_EXT_frag_depth : enable\n#endif\n\n  precision mediump float;\n\n  uniform vec4 planes[6];\n  uniform int do_plane_clipping, circularPoints;\n  uniform float intensityBlend;\n\n  uniform sampler2D overlay;\n\n  varying vec3 out_color;\n  varying vec3 out_intensity;\n  varying vec3 fpos;\n\n  void main() {\n      if (do_plane_clipping \x3e 0) {\n          for(int i \x3d 0 ; i \x3c 6 ; i ++) {\n              if (dot(planes[i], vec4(fpos, 1.0)) \x3c 0.0)\n                  discard;\n          }\n      }\n\n\n        if (circularPoints \x3e 0) {\n        float a \x3d pow(2.0*(gl_PointCoord.x - 0.5), 2.0);\n        float b \x3d pow(2.0*(gl_PointCoord.y - 0.5), 2.0);\n        float c \x3d 1.0 - (a + b);\n\n        if(c \x3c 0.0){\n            discard;\n        }      \n\n#if defined have_frag_depth\n        gl_FragDepthEXT \x3d gl_FragCoord.z + 0.002*(1.0-pow(c, 1.0)) * gl_FragCoord.w;\n#endif\n      }\n      gl_FragColor \x3d vec4(mix(out_color, out_intensity, intensityBlend), 1.0);\n  }")].join(""):
"\n#if defined have_frag_depth\n#extension GL_EXT_frag_depth : enable\n#endif\n\n  precision mediump float;\n\n  uniform vec4 planes[6];\n  uniform int do_plane_clipping, circularPoints;\n  uniform float intensityBlend;\n\n  uniform sampler2D overlay;\n\n  varying vec3 out_color;\n  varying vec3 out_intensity;\n  varying vec3 fpos;\n\n  void main() {\n      if (do_plane_clipping \x3e 0) {\n          for(int i \x3d 0 ; i \x3c 6 ; i ++) {\n              if (dot(planes[i], vec4(fpos, 1.0)) \x3c 0.0)\n                  discard;\n          }\n      }\n\n\n        if (circularPoints \x3e 0) {\n        float a \x3d pow(2.0*(gl_PointCoord.x - 0.5), 2.0);\n        float b \x3d pow(2.0*(gl_PointCoord.y - 0.5), 2.0);\n        float c \x3d 1.0 - (a + b);\n\n        if(c \x3c 0.0){\n            discard;\n        }      \n\n#if defined have_frag_depth\n        gl_FragDepthEXT \x3d gl_FragCoord.z + 0.002*(1.0-pow(c, 1.0)) * gl_FragCoord.w;\n#endif\n      }\n      gl_FragColor \x3d vec4(mix(out_color, out_intensity, intensityBlend), 1.0);\n  }");
h=Zk.d(g,N([h,q],0));a=Ic([gi,hi,vi,kj,Jj,Lj,Xj,Yj,ek],[a,d,c,g,b,f,h,new km(U.a?U.a(Y):U.call(null,Y),null,null,null),e]);return U.a?U.a(a):U.call(null,a)}();jk(h,"__internal",function(){return function(a,b,d,e){return dm(Jc.c(e,$h,K.a?K.a(c):K.call(null,c)))}}(h,d,e,f,g,a));jk(c,"__internal-ss",function(a){return function(b,c,d,e){b=new Cn(a,Fc,e,null,null,null);c=An.a(b);c=ad(c)?S.b($d,c):c;c=R.b(c,vi);return Mn(zn(b,new V(null,1,5,X,[vi],null)),c)}}(h,d,e,f,g,a));a=a.state;h=new v(null,2,[Ci,
h,$h,c],null);ce.b?ce.b(a,h):ce.call(null,a,h)}l.Cc=function(a,b,c){var d=this;a=function(){var a=Ci.a(function(){var a=d.state;return K.a?K.a(a):K.call(null,a)}());return K.a?K.a(a):K.call(null,a)}();a=Jc.c(a,$h,function(){var a=$h.a(function(){var a=d.state;return K.a?K.a(a):K.call(null,a)}());return K.a?K.a(a):K.call(null,a)}());return jm(Yj.a(a),a,b,c)};
l.Ac=function(a,b){var c=this,d=b.key,e=Ci.a(function(){var a=c.state;return K.a?K.a(a):K.call(null,a)}());if(!w(b.provides))throw Error("The loader doesn't advertise what it provides");return ee.d(e,re,new V(null,1,5,X,[Lj],null),Jc,N([d,b],0))};l.Dc=function(a,b,c){var d=this;a=Ci.a(function(){var a=d.state;return K.a?K.a(a):K.call(null,a)}());var e=kj.a(K.a?K.a(a):K.call(null,a)).canvas;console.log("reiszing view!",b,c);On(e,b,c);return ee.c(a,Hf,new v(null,2,[hi,b,ek,c],null))};
l.Bc=function(a,b){var c=this,d=Ci.a(function(){var a=c.state;return K.a?K.a(a):K.call(null,a)}());return ee.d(d,re,new V(null,1,5,X,[Vg],null),Gc,N([b],0))};l.La=function(a,b){return cd(new Kf(null,new v(null,1,[ui,null],null),null),b)?Kc.b(Nc(le.b(Y,this),this.u),b):new Pn(this.state,this.u,Td(Kc.b(this.r,b)),null)};l.Ea=function(a,b,c){return w(vd.b?vd.b(ui,b):vd.call(null,ui,b))?new Pn(c,this.u,this.r,null):new Pn(this.state,this.u,Jc.c(this.r,b,c),null)};
l.M=function(){return E(Md.b(new V(null,1,5,X,[new V(null,2,5,X,[ui,this.state],null)],null),this.r))};l.F=function(a,b){return new Pn(this.state,b,this.r,this.n)};l.N=function(a,b){return Vc(b)?hb(this,C.b(b,0),C.b(b,1)):Pa.c(Wa,this,b)};var Rn=new v(null,2,[ck,new v(null,1,[Pj,Fc],null),pj,new v(null,2,[vh,new V(null,3,5,X,[0,0,0],null),ji,Y],null)],null),Sn=function(){function a(a,b,c,g){if(a?a.pc:a)return a.pc(0,b,c,g);var h;h=Sn[t(null==a?null:a)];if(!h&&(h=Sn._,!h))throw z("IPlasioRenderer.set-clear-color",a);return h.call(null,a,b,c,g)}function b(a,b){if(a?a.oc:a)return a.oc(0,b);var c;c=Sn[t(null==a?null:a)];if(!c&&(c=Sn._,!c))throw z("IPlasioRenderer.set-clear-color",a);return c.call(null,a,b)}var c=null,c=function(c,e,f,
g){switch(arguments.length){case 2:return b.call(this,c,e);case 4:return a.call(this,c,e,f,g)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.i=a;return c}();function Tn(a,b){if(a?a.bc:a)return a.bc(0,b);var c;c=Tn[t(null==a?null:a)];if(!c&&(c=Tn._,!c))throw z("IPlasioRenderer.add-camera",a);return c.call(null,a,b)}function Un(a,b,c){if(a?a.vc:a)return a.vc(0,b,c);var d;d=Un[t(null==a?null:a)];if(!d&&(d=Un._,!d))throw z("IPlasioRenderer.update-camera",a);return d.call(null,a,b,c)}
var Vn=function(){function a(a,b,c,g){if(a?a.rc:a)return a.rc(0,b,c,g);var h;h=Vn[t(null==a?null:a)];if(!h&&(h=Vn._,!h))throw z("IPlasioRenderer.set-eye-position",a);return h.call(null,a,b,c,g)}function b(a,b){if(a?a.qc:a)return a.qc(0,b);var c;c=Vn[t(null==a?null:a)];if(!c&&(c=Vn._,!c))throw z("IPlasioRenderer.set-eye-position",a);return c.call(null,a,b)}var c=null,c=function(c,e,f,g){switch(arguments.length){case 2:return b.call(this,c,e);case 4:return a.call(this,c,e,f,g)}throw Error("Invalid arity: "+
arguments.length);};c.b=b;c.i=a;return c}(),Wn=function(){function a(a,b,c,g){if(a?a.uc:a)return a.uc(0,b,c,g);var h;h=Wn[t(null==a?null:a)];if(!h&&(h=Wn._,!h))throw z("IPlasioRenderer.set-target-position",a);return h.call(null,a,b,c,g)}function b(a,b){if(a?a.tc:a)return a.tc(0,b);var c;c=Wn[t(null==a?null:a)];if(!c&&(c=Wn._,!c))throw z("IPlasioRenderer.set-target-position",a);return c.call(null,a,b)}var c=null,c=function(c,e,f,g){switch(arguments.length){case 2:return b.call(this,c,e);case 4:return a.call(this,
c,e,f,g)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.i=a;return c}(),Xn=function(){function a(a,b,c,g,h){if(a?a.hc:a)return a.hc(0,b,c,g,h);var k;k=Xn[t(null==a?null:a)];if(!k&&(k=Xn._,!k))throw z("IPlasioRenderer.add-scale-object",a);return k.call(null,a,b,c,g,h)}function b(a,b,c){if(a?a.gc:a)return a.gc(0,b,c);var g;g=Xn[t(null==a?null:a)];if(!g&&(g=Xn._,!g))throw z("IPlasioRenderer.add-scale-object",a);return g.call(null,a,b,c)}var c=null,c=function(c,e,f,g,h){switch(arguments.length){case 3:return b.call(this,
c,e,f);case 5:return a.call(this,c,e,f,g,h)}throw Error("Invalid arity: "+arguments.length);};c.c=b;c.s=a;return c}();function Yn(a){if(a?a.kc:a)return a.kc();var b;b=Yn[t(null==a?null:a)];if(!b&&(b=Yn._,!b))throw z("IPlasioRenderer.remove-all-scale-objects",a);return b.call(null,a)}function Zn(a,b,c){if(a?a.fc:a)return a.fc(0,b,c);var d;d=Zn[t(null==a?null:a)];if(!d&&(d=Zn._,!d))throw z("IPlasioRenderer.add-prop-listener",a);return d.call(null,a,b,c)}
function $n(a,b){if(a?a.mc:a)return a.mc(0,b);var c;c=$n[t(null==a?null:a)];if(!c&&(c=$n._,!c))throw z("IPlasioRenderer.remove-prop-listener",a);return c.call(null,a,b)}function ao(a,b){if(a?a.dc:a)return a.dc(0,b);var c;c=ao[t(null==a?null:a)];if(!c&&(c=ao._,!c))throw z("IPlasioRenderer.add-point-buffer",a);return c.call(null,a,b)}
function bo(a,b){if(a?a.lc:a)return a.lc(0,b);var c;c=bo[t(null==a?null:a)];if(!c&&(c=bo._,!c))throw z("IPlasioRenderer.remove-point-buffer",a);return c.call(null,a,b)}function co(a,b){if(a?a.cc:a)return a.cc(0,b);var c;c=co[t(null==a?null:a)];if(!c&&(c=co._,!c))throw z("IPlasioRenderer.add-loader",a);return c.call(null,a,b)}function eo(a,b){if(a?a.sc:a)return a.sc(0,b);var c;c=eo[t(null==a?null:a)];if(!c&&(c=eo._,!c))throw z("IPlasioRenderer.set-render-options",a);return c.call(null,a,b)}
function fo(a,b,c){if(a?a.jc:a)return a.jc(0,b,c);var d;d=fo[t(null==a?null:a)];if(!d&&(d=fo._,!d))throw z("IPlasioRenderer.pick-point",a);return d.call(null,a,b,c)}function go(a,b){if(a?a.ic:a)return a.ic(0,b);var c;c=go[t(null==a?null:a)];if(!c&&(c=go._,!c))throw z("IPlasioRenderer.apply-state",a);return c.call(null,a,b)}function ho(a,b,c){if(a?a.nc:a)return a.nc(0,b,c);var d;d=ho[t(null==a?null:a)];if(!d&&(d=ho._,!d))throw z("IPlasioRenderer.resize-view!",a);return d.call(null,a,b,c)}
function io(a,b){if(a?a.ec:a)return a.ec(0,b);var c;c=io[t(null==a?null:a)];if(!c&&(c=io._,!c))throw z("IPlasioRenderer.add-post-render",a);return c.call(null,a,b)}function jo(a,b,c,d,e){this.state=a;this.za=b;this.u=c;this.r=d;this.n=e;this.j=2229667594;this.q=8192}l=jo.prototype;l.J=function(a,b){return fb.c(this,b,null)};l.I=function(a,b,c){switch(b instanceof T?b.qa:null){case "render-engine":return this.za;case "state":return this.state;default:return R.c(this.r,b,c)}};
l.w=function(a,b,c){return Vf(b,function(){return function(a){return Vf(b,ag,""," ","",c,a)}}(this),"#renderer.core.PlasioRenderer{",", ","}",c,Md.b(new V(null,2,5,X,[new V(null,2,5,X,[ui,this.state],null),new V(null,2,5,X,[ph,this.za],null)],null),this.r))};l.A=function(){return this.u};l.O=function(){return 2+O(this.r)};l.D=function(){var a=this.n;return null!=a?a:this.n=a=nd(this)};l.C=function(a,b){return w(w(b)?this.constructor===b.constructor&&$e(this,b):b)?!0:!1};
l.ec=function(a,b){var c=Gn,d;d=this.za;d=K.a?K.a(d):K.call(null,d);return c(d,b)};l.lc=function(a,b){return ee.i(this.state,re,new V(null,1,5,X,[vi],null),function(){return function(a){return ke.b(Nf([kk(b)]),a)}}(this))};l.vc=function(a,b,c){return ee.d(this.state,re,new V(null,3,5,X,[ck,Pj,b],null),Hf,N([c],0))};l.bc=function(a,b){return ee.d(this.state,re,new V(null,2,5,X,[ck,Pj],null),Gc,N([b],0))};l.pc=function(a,b,c,d){return Sn.b(this,new V(null,3,5,X,[b,c,d],null))};
l.oc=function(a,b){return ee.i(this.state,qe,new V(null,2,5,X,[pj,vh],null),b)};l.mc=function(a,b){var c=this.state;Kb(c,b);return c};l.ic=function(a,b){var c=this.state;return ce.b?ce.b(c,b):ce.call(null,c,b)};
l.fc=function(a,b,c){var d=this;a=""+B(kl());b=ge.b(yd,rl(b));var e=Km.a(1);ym(function(a,b,e,k){return function(){var m=function(){return function(a){return function(){function b(c){for(;;){var d;a:{try{for(;;){var e=a(c);if(!vd(e,$)){d=e;break a}}}catch(f){if(f instanceof Object){c[5]=f;Tk(c);d=$;break a}throw f;}d=void 0}if(!vd(d,$))return d}}function c(){var a=[null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.m=c;d.a=b;return d}()}(function(a,b,e){return function(a){if(1===a[1]){var b;b=d.state;b=K.a?K.a(b):K.call(null,b);b=oe.b(b,e);b=hg(b);b=c.a?c.a(b):c.call(null,b);return Sk(a,b)}return null}}(a,b,e,k),a,b,e,k)}(),n=function(){var b=m.m?m.m():m.call(null);b[6]=a;return b}();return Pk(n)}}(e,a,b,this));dg(d.state,a,function(a,b,d){return function(e,m,n,p){e=oe.b(p,b);n=oe.b(n,b);if(oc.b(e,n))return null;m=Km.a(1);ym(function(a,
b,d,e,f,g){return function(){var h=function(){return function(a){return function(){function b(c){for(;;){var d;a:{try{for(;;){var e=a(c);if(!vd(e,$)){d=e;break a}}}catch(f){if(f instanceof Object){c[5]=f;Tk(c);d=$;break a}throw f;}d=void 0}if(!vd(d,$))return d}}function c(){var a=[null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.m=
c;d.a=b;return d}()}(function(a,b){return function(a){if(1===a[1]){var d=hg(b),d=c.a?c.a(d):c.call(null,d);return Sk(a,d)}return null}}(a,b,d,e,f,g),a,b,d,e,f,g)}(),k=function(){var b=h.m?h.m():h.call(null);b[6]=a;return b}();return Pk(k)}}(m,e,n,a,b,d));return m}}(a,b,this));return a};l.cc=function(a,b){var c=En,d;d=this.za;d=K.a?K.a(d):K.call(null,d);return c(d,b)};l.jc=function(a,b,c){a=Dn;var d;d=this.za;d=K.a?K.a(d):K.call(null,d);return a(d,b,c)};
l.dc=function(a,b){return ee.d(this.state,re,new V(null,1,5,X,[vi],null),Gc,N([kk(b)],0))};l.kc=function(){return ee.i(this.state,qe,new V(null,1,5,X,[Tg],null),Fc)};l.nc=function(a,b,c){a=Fn;var d;d=this.za;d=K.a?K.a(d):K.call(null,d);return a(d,b,c)};l.rc=function(a,b,c,d){return Vn.b(this,new V(null,3,5,X,[b,c,d],null))};l.qc=function(a,b){return ee.i(this.state,qe,new V(null,2,5,X,[ck,Zh],null),b)};l.sc=function(a,b){return ee.d(this.state,re,new V(null,2,5,X,[pj,ji],null),Hf,N([b],0))};
l.uc=function(a,b,c,d){return Wn.b(this,new V(null,3,5,X,[b,c,d],null))};l.tc=function(a,b){return ee.i(this.state,qe,new V(null,2,5,X,[ck,Dj],null),b)};l.hc=function(a,b,c,d,e){jl.s?jl.s("Adding scale object",b,c,d,e):jl.call(null,"Adding scale object",b,c,d,e);return Xn.c(this,b,new V(null,3,5,X,[c,d,e],null))};l.gc=function(a,b,c){return ee.d(this.state,re,new V(null,1,5,X,[Tg],null),Gc,N([new V(null,2,5,X,[b,c],null)],0))};
l.La=function(a,b){return cd(new Kf(null,new v(null,2,[ph,null,ui,null],null),null),b)?Kc.b(Nc(le.b(Y,this),this.u),b):new jo(this.state,this.za,this.u,Td(Kc.b(this.r,b)),null)};l.Ea=function(a,b,c){return w(vd.b?vd.b(ui,b):vd.call(null,ui,b))?new jo(c,this.za,this.u,this.r,null):w(vd.b?vd.b(ph,b):vd.call(null,ph,b))?new jo(this.state,c,this.u,this.r,null):new jo(this.state,this.za,this.u,Jc.c(this.r,b,c),null)};
l.M=function(){return E(Md.b(new V(null,2,5,X,[new V(null,2,5,X,[ui,this.state],null),new V(null,2,5,X,[ph,this.za],null)],null),this.r))};l.F=function(a,b){return new jo(this.state,this.za,b,this.r,this.n)};l.N=function(a,b){return Vc(b)?hb(this,C.b(b,0),C.b(b,1)):Pa.c(Wa,this,b)};
function ko(a,b){return function(){function c(a){var b=null;if(0<arguments.length){for(var b=0,c=Array(arguments.length-0);b<c.length;)c[b]=arguments[b+0],++b;b=new F(c,0)}return d.call(this,b)}function d(c){c=mg.d(c,N([lg,!0],0));return hg(S.c(a,b,c))}c.l=0;c.h=function(a){a=E(a);return d(a)};c.d=d;return c}()}
function lo(a,b){return function(){function c(a){var b=null;if(0<arguments.length){for(var b=0,c=Array(arguments.length-0);b<c.length;)c[b]=arguments[b+0],++b;b=new F(c,0)}return d.call(this,b)}function d(c){return S.c(a,b,c)}c.l=0;c.h=function(a){a=E(a);return d(a)};c.d=d;return c}()}
function mo(a){var b=new jo(U.a?U.a(Y):U.call(null,Y),U.a?U.a(null):U.call(null,null),null,null,null);jl.a?jl.a("Doing startup!"):jl.call(null,"Doing startup!");var c=new Pn(U.a?U.a(null):U.call(null,null),null,null,null);Qn(c,a,b.state);jl.a?jl.a("Setting up state!"):jl.call(null,"Setting up state!");a=b.za;ce.b?ce.b(a,c):ce.call(null,a,c);c=b.state;a=re.i(Rn,new V(null,2,5,X,[ck,Pj],null),Gc,new v(null,3,[Si,!0,pi,"perspective",zi,70],null));ce.b?ce.b(c,a):ce.call(null,c,a);return hg(Ic([bh,rh,
Ah,bi,ci,ei,ni,qi,xi,Di,Pi,Ui,Wi,dj,zj,Sj,Zj],[ko(Zn,b),ko(Wn,b),ko(Vn,b),ko(Xn,b),ko(Un,b),ko(fo,b),ko(Yn,b),ko(Sn,b),ko(ho,b),ko(Tn,b),lo(bo,b),ko(go,b),lo(io,b),lo(ao,b),ko(eo,b),ko($n,b),ko(co,b)]))}var no=["renderer","core","createRenderer"],oo=aa;no[0]in oo||!oo.execScript||oo.execScript("var "+no[0]);for(var po;no.length&&(po=no.shift());){var qo;if(qo=!no.length)qo=void 0!==mo;qo?oo[po]=mo:oo=oo[po]?oo[po]:oo[po]={}};
})();

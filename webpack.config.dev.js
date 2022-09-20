const path = require('path'); // path ya esta disponible en node
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const copyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

// /** @type {import('webpack').Configuration} */
module.exports = {
  // Entry nos permite decir el archivo de punto de entrada de nuestra aplicación
  entry: "./src/index.js",
  // Output nos permite decir hacia dónde va enviar lo que va a preparar webpacks
  output: {
    // path es donde estará la carpeta donde se guardará los archivos
    // Con path.resolve podemos decir dónde va estar la carpeta y la ubicación del mismo
    path: path.resolve(__dirname, "dist"),
    // filename le pone el nombre al archivo final
    filename: "[name].[contenthash].js",
    assetModuleFilename: 'assets/images/[hash][ext][query]',
  },
  mode: 'development',
  watch: true,
  resolve: {
    // Aqui ponemos las extensiones que tendremos en nuestro proyecto para webpack los lea
    extensions: [".js"],
    alias: {
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@templates': path.resolve(__dirname, 'src/templates/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
      '@images': path.resolve(__dirname, 'src/assets/images/'),
    }
  },
  module: {
    rules: [
      {
        // Test declara que extensión de archivos a quienes aplicara el loader. Son los archivos test
        test: /\.js$/,
        // Use es un arreglo u objeto donde dices que loader aplicaras
        use: {
          loader: "babel-loader"
        },
        // Exclude permite omitir archivos o carpetas especificas
        exclude: /node_modules/
      },
      {
        test: /\.css|.styl$/i,
        use: [ //Aqui se puede poner un arreglo o un obheto, dependiendo de las configuraciones necesarias
          MiniCssExtractPlugin.loader,
          //Aqui se agregan los loaders que se van a utilizar
          'css-loader',
          'stylus-loader'
        ],
      },
      { //Regla para copiar las imagenes
        test: /\.png/,
        type: "asset/resource"
      },
      { //Regla para la copia de fonts
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name].[contenthash].[ext]",
        },
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './public/index.html',
      filename: './index.html'
    }),
    new MiniCssExtractPlugin({
      filename: "assets/[name].[contenthash].css"
    }),
    new copyPlugin({
      patterns: [
        {
          //En esta parte indicamos de donde queremos tomar los recursos que queremos copiar
          //Se puede indicar que se copie un solo archivo o también se puede indicar hacer una copia de la carpeta completa:
          //En este cas, se usa todo el contenido de images
          from: path.resolve(__dirname, 'src', 'assets/images'),
          //Aqui se indica hacia donde va a mandar estos archivos copiados
          to: "assets/images"
        }
      ]
    }),
    new Dotenv(),
  ],
}
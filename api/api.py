from dbco import *
import flask, json, pymongo, time
from flask import Flask, request
from flask.ext.cors import CORS
import getGraph
from jsonify import *

app = Flask(__name__)
CORS(app)

@app.route('/graph_kw/start/<start>/end/<end>')
def daterangeGraphKw(start, end):
	k = int(request.args.get('k', 2))
	return jsonify(getGraph.kwGraph(start, end, k))

@app.route('/graph_tfidf/start/<start>/end/<end>')
def daterangeGraphTfidf(start, end):
	eps = float(request.args.get('eps', 0.4))
	return jsonify(getGraph.tfidfGraph(start, end, eps))

def main():
	app.run(host='0.0.0.0', port=4005, debug=True)

if __name__ == '__main__':
	main()
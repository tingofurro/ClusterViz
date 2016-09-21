from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime, timedelta
from dateutil import parser
from bson import ObjectId
from dbco import *
import random, time, json, nltk
import numpy as np

def tokenize(text):
    return [w.lower() for w in nltk.word_tokenize(text) if w.isalnum()]

def getNodes(startDate, endDate):
	startDatetime = parser.parse(startDate)
	endDatetime = parser.parse(endDate)

	originalSources = ["reuters.com", "theguardian.com", "cnn.com", "bbc.co.uk", "france24.com", "aljazeera.com", "ap.org", "wikinews.org", "nytimes.com", "euronews.com", "middleeasteye.net", "aa.com.tr", "independent.co.uk", "indiatimes.com", "rt.com", "latimes.com", "mercopress.com", "bnamericas.com", "chinadaily.com.cn", "allafrica.com"]
	match = {'$match': {'pubtime': {'$gte': startDatetime, '$lte': endDatetime}, 'source': {'$in': originalSources}}}
	proj = {'$project': {'id': '$_id', 'name': '$title', 'group': {'$ifNull': ['$topic', 0]}, 'keywords': 1, 'content': 1}}

	return list(db.article.aggregate([match, proj]))

def kwGraph(startDate, endDate, k=2):
	nodes = getNodes(startDate, endDate)
	for n in nodes:
		n['keywords'] = set(n.get('keywords', []))
	edges = [];
	for i in range(len(nodes)):
		for j in range(len(nodes)):
			if i > j:
				n = nodes[i]; m = nodes[j];
				le = len(n['keywords']&m['keywords'])
				if le >= k:
					edges.append({'source': n['id'], 'target': m['id'], 'value': le})

	for n in nodes:
		if n['group'] == 0:
			n['group'] = int(500*random.random())
		del n['keywords']
		del n['content']
		del n['name']
	return {'nodes': nodes, 'edges': edges}

def tfidfGraph(startDate, endDate, eps=0.4):
	nodes = getNodes(startDate, endDate)
	
	count_vect = CountVectorizer(tokenizer=tokenize, stop_words='english')
	tfidf_trans = TfidfTransformer()

	tfidf = tfidf_trans.fit_transform(count_vect.fit_transform([a['content'] for a in nodes]))
	distances = cosine_similarity(tfidf)
	print "Done calculating distances"
	for n in nodes:
		n['keywords'] = set(n.get('keywords', []))
	edges = [];

	for i in range(len(nodes)):
		for j in np.where(distances[i, :] > eps)[0]:
			if i < j:
				edges.append({'source': nodes[i]['id'], 'target': nodes[j]['id'], 'value': distances[i,j]})


	for n in nodes:
		if n['group'] == 0:
			n['group'] = int(500*random.random())
		del n['keywords']
		del n['name']
		del n['content']
	return {'nodes': nodes, 'edges': edges}

if __name__ == '__main__':
	kwGraph()
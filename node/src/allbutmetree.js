/*
 * Copyright 2014 Jason Randolph Eads
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Author: Jason R. Eads <jeads442@gmail.com> (c) 2014
 * Collects the product of all but the index for each slot
 */

var Long = require("long");

// INPUT - soucre: https://www.interviewstreet.com/recruit/challenges/faq/view
process.stdin.resume();
process.stdin.setEncoding("ascii");
var input = "";
process.stdin.on("data", function (chunk) {
				 input += chunk;
				 });
process.stdin.on("end", solve);
// end INPUT

function solve() {
	var numbers = cleanInput(input);

	// coerce newline(s) and convert to numbers
	function cleanInput( input ) {
		var ret = [];
		var clean = input.trim().replace(/\n/g,' ').split(' ');
		clean = clean.slice(1,clean.length);
		for( c in clean ) {
			ret.push(Long.fromString(clean[c]));
		}
		return ret;
	}
	
	// For each element, trace out the solution
	tree = buildTree(numbers);
	products = [];
	
	for (n in numbers) {
		console.log(traceTree(tree, n).toString());
	}

	// Builds a special node tree which can be parsed quickly for answers
	function buildTree(values) {
		var levels = [];
		levels.push([]);
		
		// First layer is created raw from input
		for (v in values) {
			var node = {};
			node.keys = [v];
			node.value = values[v];
			levels[0].push(node);
		}
		// Now create the layers above
		indexL = 0; // The level we're building on
		indexA = 1; // The level we're building
		while (levels[indexL].length > 1) {
			levels.push([]);
			
			// combine the elements from below
			for (i = 0; i < levels[indexL].length; i++) {
				if (levels[indexL][i] !== undefined) {
					// At least one node below...
					
					var node = {};
					if (levels[indexL][i + 1] !== undefined) {
						// Two nodes below. Combine.
						node.keys = levels[indexL][i].keys.concat(levels[indexL][i + 1].keys);
						node.value = levels[indexL][i].value.multiply(levels[indexL][i + 1].value);
						node.left = levels[indexL][i];
						node.right = levels[indexL][i + 1];
						i++;
					}
					else {
						// Only one node below. Pass up tree.
						node.keys = levels[indexL][i].keys.concat([]);
						node.value = levels[indexL][i].value;
						node.left = levels[indexL][i];
					}
					levels[indexA].push(node);
				}
			}
			indexL = indexA;
			indexA++;
		}
		return levels[indexL][0];
	}
	// Walk down from the top of the tree, excluding an index while multiplying
	function traceTree(tree, index) {
		function keyMatch(node, index) {
			if ((node.keys).indexOf(index) != -1) {
				return true;
			}
			return false;
		}
		
		function traceNode(node, index) {
			if (node.right === undefined) {
				// Either at bottom or on fully collapsed track
				if(node.left === undefined) {
					// Made it all the way down...
					return Long.ONE;
				}
				else {
					// Track down left to prevent orpahed nodes
					return traceNode(node.left, index);
				}
			}
			// One has the key, checking right...
			if (keyMatch(node.right, index)) {
				// and it has the key! Trace right and return left value.
				return traceNode(node.right, index).multiply(node.left.value);
			}
			else {
				// else trace the left and return right value.
				return traceNode(node.left, index).multiply(node.right.value);
			}
		}
		return traceNode(tree, index);
	}
}
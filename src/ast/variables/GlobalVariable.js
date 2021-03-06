import Variable from './Variable';
import pureFunctions from '../nodes/shared/pureFunctions';

export default class GlobalVariable extends Variable {
	constructor ( name ) {
		super( name );
		this.isExternal = true;
		this.isGlobal = true;
		this.isReassigned = false;
		this.included = true;
	}

	addReference ( identifier ) {
		if ( identifier.isReassignment ) this.isReassigned = true;
	}

	hasEffectsWhenAccessedAtPath ( path ) {
		// path.length == 0 can also have an effect but we postpone this for now
		return path.length > 0
			&& !pureFunctions[ [ this.name, ...path ].join( '.' ) ]
			&& !pureFunctions[ [ this.name, ...path.slice( 0, -1 ) ].join( '.' ) ]
			&& !(path.length > 1
				&& pureFunctions[ [ this.name, ...path.slice( 0, -2 ) ].join( '.' ) ]
				&& path[ path.length - 2 ] === 'prototype');
	}

	hasEffectsWhenCalledAtPath ( path ) {
		return !pureFunctions[ [ this.name, ...path ].join( '.' ) ];
	}
}

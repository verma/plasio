/** @jsx React.DOM */

var React = require('react');
var classNames = require('classnames');

var ReactBootstrap = require('react-bootstrap');
var $ = require('jquery');
var render = require('./render');
var _ = require('lodash');

var util = require('./util');

React.createClass = require('create-react-class');

// Import some react-bootstrap componenets
//
var Button = ReactBootstrap.Button,
    Modal = ReactBootstrap.Modal,
    ModalTrigger = ReactBootstrap.ModalTrigger,
    Grid = ReactBootstrap.Grid,
    Row = ReactBootstrap.Row,
    Col = ReactBootstrap.Col,
    Alert = ReactBootstrap.Alert,
    FormGroup = ReactBootstrap.FormGroup,
    FormControl = ReactBootstrap.FormControl;


console.log(ReactBootstrap);

var withRefresh = require('./util').withRefresh;

(function(scope) {
    "use strict";

    var InundationControls = React.createClass({
        getInitialState: function() {
            return { enabled: false,
                slider: false,
                opacity: 50,
                value: 0};
        },

        componentDidMount: function() {
        },

        componentDidUpdate: function() {
            // if we have #inun, make it into a slider
            if (!this.state.slider) {
                var n = $("#inun").get(0);
                var m = $("#inun-opacity").get(0);

                var o = this;

                $(n).noUiSlider({
                    range:[0, 1000],
                    start: o.state.value,
                    handles: 1,
                    connect: "lower",
                    slide: withRefresh(function() {
                        $.event.trigger({
                            type: 'plasio.inundationChanged'
                        });

                        o.setState({value: $(n).val()});
                    })
                });

                $(m).noUiSlider({
                    range:[0, 100],
                    start: o.state.opacity,
                    handles: 1,
                    connect: "lower",
                    slide: withRefresh(function() {
                        $.event.trigger({
                            type: 'plasio.inundationOpacityChanged'
                        });

                        o.setState({opacity: $(m).val()});
                    })
                });

                o.setState({slider: true});
            }
        },

        render: function() {
            var classes = classNames({
                'btn btn-block btn-sm': true,
                'btn-default': !this.state.enabled,
                'btn-success active': this.state.enabled
            });

            var additionControls = this.state.enabled ?
                (<div>
                    <div id="inun"/>
                    <h5 className="not-first">Adjust Opacity of Inundation plane</h5>
                    <div id="inun-opacity"/>
                </div>) :
                    <div /> ;


            return (
                <div>
                    <button type="button"
                            className={classes}
                            style={{marginBottom: '15px'}}
                            onClick={withRefresh(this.toggle)}>
                        {this.state.enabled? "Disable" : "Enable"}
                    </button>
                    {additionControls}
                </div>
            );
        },

        toggle: function() {
            var nextEnabled = !this.state.enabled;
            this.setState({enabled: nextEnabled,
                          slider: false});

                          $.event.trigger({
                              type: 'plasio.inundationEnable',
                              enable: nextEnabled
                          });
        }
    });

    var LineSegment = React.createClass({
        render: function() {
            return (
                <tr style={{ backgroundColor: '#' + this.props.start.color.getHexString() }}>
                    <td> {this.props.lineIndex} </td>
                    <td style={{textAlign: 'right'}}> {this.props.start.distanceTo(this.props.end).toFixed(1)}</td>
                    <td>
                        <a href="#" onClick={this.addRegion}>
                            <span className="glyphicon glyphicon-picture" />
                        </a>
                    </td>
                </tr>
            );
        },

        addRegion: function(e) {
            render.createNewRegion(this.props.start, this.props.end, this.props.start.color);
        }
    });


    var LineSegmentsBox = React.createClass({
        getInitialState: function() {
            return { points: [] };
        },

        componentWillMount: function() {
            var c = this;
            $(document).on('plasio.mensuration.pointAdded', function(e) {
                c.setState({ points: c.state.points.concat([e.point])});
            });

            $(document).on('plasio.mensuration.pointRemoved', function(e) {
                c.setState({ points: _.without(c.state.points, e.point) });
            });

            $(document).on('plasio.mensuration.pointsReset', function(e) {
                console.log("Resetting all points");
                c.setState({ points: [] });
            });
        },

        render: function() {
            var lines = [];
            var index = 0;
            for (var i = 0 ; i < this.state.points.length - 1 ; i ++) {
                var p1 = this.state.points[i],
                p2 = this.state.points[i+1];
                if (p1.id === p2.id) {
                    lines.push(LineSegment({ lineIndex: index+1, start: p1, end: p2 }));
                    index ++;
                }
            }

            if (lines.length === 0)
                return (
                    <div className="its-empty">No Measurement Segments</div>
                );

            return (
                <table className="table">
                    <thead>
                    <tr>
                        <td>Index</td>
                        <td style={{textAlign: 'right'}}>Length</td>
                        <td></td>
                    </tr>
                    </thead>
                    <tbody>
                    {lines}
                    </tbody>
                </table>
            );
        }
    });

    var RegionViewport = React.createClass({
        render: function() {
            var classes = classNames({
                'btn btn-block btn-sm': true,
                'btn-default': !this.props.region.active,
                'btn-success active': this.props.region.active
            });

            return (
                <button
                    className={classes}
                    onClick={this.props.toggle}>
                    {this.props.region.active ? "Deactivate" : "Activate"}
                </button>
            );
        }
    });

    var RegionSizeSlider = React.createClass({
        componentDidMount: function() {
            var a = this.getDOMNode();
            $(a).noUiSlider({
                range: [1, 10],
                start: Math.round(this.props.startScale),
                step: 1,
                handles: 1,
                connect: false,
                slide: this.setSize
            });
        },
        render: function() {
            return (
                <div style={{ marginBottom: '15px' }} />
            );
        },
        setSize: function() {
            var v = $(this.getDOMNode()).val();
            this.props.setSize(v);
        }
    });

    var Region = React.createClass({
        render: function() {
            var cx = classNames;
            var classesFor = function(active) {
                return cx({
                    'btn': true,
                    'btn-default': true,
                    'btn-sm': true,
                    'active': active });
            };

            console.log('Rendering');

            var regionControls =
                this.props.region.type === 1 ? (
                    <div>
                        <RegionSizeSlider
                            region={this.props.region}
                            startScale={this.props.region.widthScale}
                            setSize={_.partial(this.props.setWidth, this.props.index)} />
                        <RegionSizeSlider
                            region={this.props.region}
                            startScale={this.props.region.heightScale}
                            setSize={_.partial(this.props.setHeight, this.props.index)} />
                    </div> ) : <div /> ;

                    return (
                        <div style={{
                        borderLeft: '10px solid #' + this.props.region.color.getHexString(),
                        marginBottom: '5px',
                        paddingLeft: '5px',
                        boxSizing: 'border-box'}}>
                        <div
                            className="btn btn-link btn-sm"
                            onClick={_.partial(this.props.remove, this.props.index)}
                            type="button"
                            style={{
                                float: 'right',
                                padding: '0px'
                            }}>
                            <span className="glyphicon glyphicon-remove" />
                        </div>
                        <div
                            className="btn-group btn-group-justified"
                            style={{marginBottom: '10px'}}>
                            <div
                                className={classesFor(this.props.region.type === 1)}
                                onClick={_.partial(this.props.setRibbon, this.props.index)}
                                type="button">Ribbon</div>
                            <div
                                className={classesFor(this.props.region.type === 2)}
                                onClick={_.partial(this.props.setAxisAligned, this.props.index)}
                                type="button">Axis-Aligned</div>
                        </div>
                        {regionControls}
                        <RegionViewport
                            region={this.props.region}
                            toggle={_.partial(this.props.toggle, this.props.index)} />
                    </div>
                    );
        },
    });

    var RegionsBox = React.createClass({
        getInitialState: function() {
            return { regions: [] };
        },

        componentWillMount: function() {
            var o = this;
            $(document).on("plasio.regions.new", function(e) {

                o.setState({ regions: o.state.regions.concat(e.region) });
            });

            $(document).on("plasio.regions.reset", function() {
                o.setState({ regions: [] });
            });

        },

        render: function() {
            if (this.state.regions.length === 0)
                return (
                    <div className="its-empty">No regions defined</div>
                );

                var toggleClip = withRefresh(function() {
                    $.event.trigger({
                        type: 'plasio.render.toggleClip'
                    });
                });

                var o = this;
                var regions = _.times(this.state.regions.length, function(i) {
                    var r = o.state.regions[i];
                    return Region({
                        index: i,
                        region: o.state.regions[i],
                        setRibbon: o.setRibbon,
                        setAxisAligned: o.setAxisAligned,
                        setWidth: o.setWidth,
                        setHeight: o.setHeight,
                        remove: o.remove,
                        toggle: o.toggle });
                });

            return (
                <div>
                    <button
                        className='btn btn-info btn-sm btn-block'
                        style={{marginBottom: '10px'}}
                        onClick={toggleClip}>
                        Toggle Regions View (T)
                    </button>
                    {regions}
                </div>
            );
        },

        setRibbon: withRefresh(function(i) {
            this.state.regions[i].type = 1;
            this.setState({ regions: this.state.regions });
        }),
        setAxisAligned: withRefresh(function(i) {
            this.state.regions[i].type = 2;
            this.setState({ regions: this.state.regions });
        }),

        setWidth: withRefresh(function(i, w) {
            this.state.regions[i].widthScale = w;
            this.setState({ regions: this.state.regions });
        }),

        setHeight: withRefresh(function(i, h) {
            this.state.regions[i].heightScale = h;

            this.setState({ regions: this.state.regions });
        }),

        remove: withRefresh(function(i) {
            console.log('Removing region');
            var r = this.state.regions[i];
            this.setState({ regions: _.without(this.state.regions, r) });

            $.event.trigger({
                type: 'plasio.regions.remove',
                region: r
            });
        }),
        toggle: withRefresh(function(i) {
            this.state.regions[i].active = !this.state.regions[i].active;
            this.setState({ regions: this.state.regions });
        })
    });

    var OpenGreyhoundPipeline = React.createClass({
        getInitialState: function() {
            return {
                canOpen: false
            };
        },

        componentDidMount: function() {
            this.updateControlState();
        },

        updateControlState: function(e) {
            var url = this.refs.pipelineUrl.getValue(),
                server = this.refs.serverAddress.getValue(),
                pipelineId = this.refs.pipelineId.getValue();

            if (e)
                e.stopPropagation();

            console.log(url, server, pipelineId);

            this.setState({
                error: null,
                canOpen: (url.length > 0) || (server.length > 0 && pipelineId.length > 0)
            });
        },

        handleOpen: function() {
            var url = this.refs.pipelineUrl.getValue(),
                server = this.refs.serverAddress.getValue(),
                pipelineId = this.refs.pipelineId.getValue();


            var comps = {};
            if (url.length > 0) {
                comps = util.parseGHComponents(url); // normalize this URL
            }
            else {
                comps = {server: server, pipelineId: pipelineId};
            }

            console.log("Got components:", comps);

            if (!comps) {
                return this.setState({error: 'The specified pipeline settings seem invalid.'}, function() {
                    var node = this.refs.pipelineUrl.getInputDOMNode();

                    node.setSelectionRange(0, node.value.length);
                    node.focus();
                });
            }

            $.event.trigger({
                type: 'plasio.loadfiles.greyhound',
                comps: [comps]
            });

            this.props.onRequestHide();
        },

        openQuickPipeline: function(pipeline) {
            $.event.trigger({
                type: 'plasio.loadfiles.greyhound',
                comps: [{server: 'test.greyhound.io:8080', pipelineId: pipeline}]
            });

            this.props.onRequestHide();
        },

        render: function() {
            var error = this.state.error ? (
                <Row>
                    <Col xs={12}>
                        <Alert bsStyle="danger">
                            <strong>There was a problem processing your request:</strong><br />
                            <span>{this.state.error}</span>
                        </Alert>
                    </Col>
                </Row> ) : <span /> ;

            return (
                <div>
                    <div className="modal-body">
                        <Grid fluid={true}>
                            <Row>
                                <Col xs={12}>
                                    <FormGroup>
                                        <FormControl type="text" placeholder="pipeline-url"
                                                     ref="pipelineUrl"
                                                     autoFocus
                                                     onChange={this.updateControlState} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <h5 style={{textAlign: "center", fontWeight:"bold", color:"#999", paddingBottom: "10px"}}>OR</h5>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={4}>
                                    <FormGroup>
                                        <FormControl type="text" placeholder="server-address"
                                                     ref="serverAddress"
                                                     onChange={this.updateControlState} />
                                    </FormGroup>
                                </Col>
                                <Col xs={8}>
                                    <FormGroup>
                                        <FormControl type="text" placeholder="pipeline-id"
                                                     ref="pipelineId"
                                                     onChange={this.updateControlState} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <h5 style={{textAlign: "center", fontWeight:"bold", color:"#999", paddingBottom: "10px"}}>OR</h5>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={6}>
                                    <Button type="button"
                                        onClick={this.openQuickPipeline.bind(this, "d7b7380b4529abaacbd963ab4c6c474b")}
                                        className="btn-block btn-default">Low Density Autzen</Button>
                                </Col>
                                <Col xs={6}>
                                    <Button type="button"
                                        onClick={this.openQuickPipeline.bind(this, "de18c06d3bbd7777b5c0bd141af81b34")}
                                        className="btn-block btn-default">High Density Half Dome</Button>
                                </Col>
                            </Row>
                            { error }
                        </Grid>
                    </div>
                    <div className="modal-footer">
                        <Button onClick={this.props.onRequestHide} bsStyle="warning">Cancel</Button>
                        <Button onClick={this.handleOpen} bsStyle="success" disabled={!this.state.canOpen}>Open Pipeline</Button>
                    </div>
                </div>
            );
        }
    });

    var openGreyhoundPipelineButton = React.createClass({
        getInitialState: function() {
            return { show: false };
        },

        render:function() {
            var o = this;
            var close = function() { o.setState({ show: false }); };
            var open = function() { o.setState({show: true}); };

            return (
                <div className="modal-container">
                    <Button
                        bsStyle="default"
                        bsSize="small"
                        className="btn-block"
                        onClick={open}
                    >
                        Open
                    </Button>

                    <Modal
                        show={this.state.show}
                        onHide={close}
                        container={this}
                        aria-labelledby="contained-modal-title"
                    >
                        <OpenGreyhoundPipeline onRequestHide={close} />
                    </Modal>
                </div>
            );
        },
    });

    // export stuff
    scope.InundationControls = InundationControls;
    scope.LineSegmentsBox = LineSegmentsBox;
    scope.RegionsBox = RegionsBox;
    scope.openGreyhoundPipelineButton = openGreyhoundPipelineButton;

})(module.exports);

/* eslint-env jest */

test('placeholder', () => {
})

/*
describe('standalone launch', () => {

  it('creates and stores state at beginning of launch flow', done => {
    sandbox.stub(SessionStorage, 'setState');

    sandbox.stub(StateGenerator, 'generate');
    StateGenerator.generate.returns('example-state');

    StandaloneLaunch.run(FHIR_APP_CONFIG)
      .then(() => {
        assert(SessionStorage.setState.calledWith('example-state'), 'setState not called with \'example-state\'');
        done();
      })
      .catch(err => done(new Error(err)));
  });

  it('redirects to authorize_uri when no state is present', done => {
    sandbox.stub(OauthUris, 'getOauthEndpoints')
      .returns(q.when(new SmartOauthEndpoints(MOCK_URIS)));

    const expectedUriRegex = new RegExp(`^${MOCK_URIS.authorize}\?.*$`);
    sandbox.stub(StateGenerator, 'generate');
    StateGenerator.generate.returns('example-state');
    sandbox.stub(SessionStorage, 'setState');

    StandaloneLaunch.run(FHIR_APP_CONFIG)
      .then(() => {
        const uriCalled = location.setCurrentLocation.getCall(0).args[0];
        assert(expectedUriRegex.test(uriCalled));
        done();
      })
      .catch(err => {
        done(new Error(err));
      });

  });
});
*/

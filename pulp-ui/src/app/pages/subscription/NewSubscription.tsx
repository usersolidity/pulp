import { SubscriptionEntity } from 'pnlp/domain';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Fade from 'react-bootstrap/Fade';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { BsQuestionCircle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { selectIdentity, selectSubscription, useAppSlice } from 'store/app-state';

import { ExternalProvider, Web3Provider } from '@ethersproject/providers';

const SuperfluidSDK = require('@superfluid-finance/js-sdk');
const Web3 = require('web3');

//const DAIx_ropsten = '0xBF6201a6c48B56d8577eDD079b84716BB4918E8A';
const ETHx_ropsten = '0x6fC99F5591b51583ba15A8C2572408257A1D2797';

type WindowInstanceWithEthereum = Window & typeof globalThis & { ethereum: ExternalProvider & { request: (request: { method: string; params?: Array<any> }) => Promise<any> } };

export function NewSubscription() {
  const [sf, setSf] = React.useState<string>('');
  const [fundingUser, setFundingUser] = React.useState<string>('');
  const [fundingFlow, setFundingFlow] = React.useState<string>('');


  let flowRate: string =  '385802469136';

  const history = useHistory();
  let { url } = useRouteMatch();

  const { actions } = useAppSlice();
  const subscription = useSelector(selectSubscription);
  const identity = useSelector(selectIdentity);
  const dispatch = useDispatch();

  //initialize Superfluid stuff
  React.useEffect(() => {
    // async function initSuperFluid() {
    //   const sf = new SuperfluidSDK.Framework({
    //     web3: new Web3((window as WindowInstanceWithEthereum).ethereum),
    //   });
    //   await sf.initialize();
    //   setSf(sf);

    //   const fundingUser = sf.user({
    //     address: '0x343712AbA29A21c9eB50Cc98D556028485146913',
    //      token: ETHx_ropsten
    //   });
    //   setFundingUser(fundingUser);
    // }
    // initSuperFluid();
  },[]) ;

  const startFlow = async () => {
    console.log('recipient: ' )
  
    // await fundingUser.flow({
    //   recipient: fundingRecipient,
    //   flowRate: flowRate //'385802469136'  //1 DAIx per month
    // });

    // const details = await fundingUser.details();
    // setFundingFlow(details.cfa.netFlow);
    // console.log(details.cfa.netFlow);
  }

  const stopFlow = async (recipient) => {
    // await fundingUser.flow({
    //   recipient: recipient,
    //   flowRate: "0"
    // });
  }


  const onChangeSubscription = (value: Partial<SubscriptionEntity>) => {
    const updated_subscription = {
      ...subscription.entity,
      properties: {
        ...subscription.entity,
        ...value,
      },
    };
    dispatch(actions.setSubscription(updated_subscription));
  };

  const onSubmitForm = (evt?: React.FormEvent<HTMLFormElement>) => {
    if (evt !== undefined && evt.preventDefault) {
      evt.preventDefault();
    }
    if (!identity.state?.ethereum_address) {
      throw new Error('Cannot create subscription without key provider.');
    }
    const updated_subscription = {
      ...subscription.entity,
      founder: identity.state?.ethereum_address,
    };
    dispatch(actions.setSubscription(updated_subscription));
    dispatch(actions.createSubscription());
    //history.push(`/account/publishing`);
  };

  const [fade, setFade] = React.useState<boolean | undefined>(false);
  setTimeout(async () => {
    await setFade(true);
  }, 200);

  return (
    <Fade in={fade}>
      <Container>
        <Row className="my-5">
          <Col></Col>
          <Col xs={12} md={6}>
            <Container className="p-0">
              <Row>
                <Col md={10}>
                  <div className="lead">Subscribe to a content/author</div>
                  <div className="text-muted small mb-3">Monthly subscription</div>
                </Col>
                <Col md={2} className="text-right">
                  <a href="/docs" target="_blank">
                    <BsQuestionCircle />
                  </a>
                  {/* TODO: add docs page */}
                </Col>
              </Row>
            </Container>
            <Card>
              <Card.Body>
                <Form onSubmit={onSubmitForm}>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label className="text-muted small">Funding User Address</Form.Label>
                    <Form.Control
                      type="input"
                      placeholder="My account address to send fund from: "
                      value={subscription.entity.fundingUser}
                      onChange={e =>
                        onChangeSubscription({
                          fundingUser: e.currentTarget.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label className="text-muted small">Content Author</Form.Label>
                    <Form.Control
                      type="input"
                      placeholder="provide the address of the Author or content"
                      value={subscription.entity.recipient}
                      onChange={e =>
                        onChangeSubscription({
                          recipient: e.currentTarget.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label className="text-muted small">Subscription Amount</Form.Label>
                    <Form.Control
                      type="input"
                      placeholder="385802469136"
                      value={subscription.entity.amount}
                      onChange={e =>
                        onChangeSubscription({
                          amount: e.currentTarget.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicCheckbox">
                    <Form.Check
                      className="text-muted small"
                      type="checkbox"
                      label="I confirm for the Subscription for the Author and monthly premium amount as indicate above."
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" block size="lg" type="submit">
                    🚀 Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </Fade>
  );
}

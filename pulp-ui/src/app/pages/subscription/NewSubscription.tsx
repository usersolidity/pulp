import { ExternalProvider } from '@ethersproject/providers';
import type { Flow } from '@superfluid-finance/js-sdk';
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

const SuperfluidSDK = require('@superfluid-finance/js-sdk');
const Web3 = require('web3');

const DAIx_ropsten = '0xBF6201a6c48B56d8577eDD079b84716BB4918E8A';
const ETHx_ropsten = '0x6fC99F5591b51583ba15A8C2572408257A1D2797';
const DAIx_rinkeby = '0x745861AeD1EEe363b4AaA5F1994Be40b1e05Ff90';

type DetailsProps = {
  address: string;
  netFlow: string;
  inFlows: Array<Flow>;
  outFlows: Array<Flow>;
};

type WindowInstanceWithEthereum = Window & typeof globalThis & { ethereum: ExternalProvider & { request: (request: { method: string; params?: Array<any> }) => Promise<any> } };

export function NewSubscription() {
  const windowWeb3 = window as any;
  const [fundingUser, setFundingUser] = React.useState<DetailsProps | any>();
  const [fundingFlow, setFundingFlow] = React.useState<string>('');
  const flowRate = '385802469136'; //1 DAIx per month

  const history = useHistory();
  let { url } = useRouteMatch();

  const { actions } = useAppSlice();
  const subscription = useSelector(selectSubscription);
  const identity = useSelector(selectIdentity);
  const dispatch = useDispatch();

  React.useEffect(() => {
    async function initSuperFluid() {
      const sf = new SuperfluidSDK.Framework({
        web3: new Web3((window as WindowInstanceWithEthereum).ethereum),
      });
      await sf.initialize();

      const fundingUser = sf.user({
        //update the address from identity
        address: identity.state?.ethereum_address, //Is this the way to get Address???
        token: DAIx_rinkeby,
      });
      setFundingUser(fundingUser);
    }
    initSuperFluid();
  }, []);

  const startFlow = async () => {
    if (subscription.entity.recipient && flowRate) {
      await fundingUser.flow({ recipient: subscription.entity.recipient, flowRate: subscription.entity.amount });
    }
  };

  const getFlow = async () => {
    const details = await fundingUser.details();
    setFundingFlow(details.cfa.netFlow);
    console.log(fundingFlow);
  };

  const stopFlow = async () => {
    await fundingUser.flow({
      recipient: subscription.entity.recipient,
      flowRate: '0',
    });
  };

  const onChangeSubscription = (value: Partial<SubscriptionEntity>) => {
    const updated_subscription = {
      ...subscription.entity,
      ...value,
    };
    dispatch(actions.setSubscription(updated_subscription));
  };

  const onSubmitForm = (evt?: React.FormEvent<HTMLFormElement>) => {
    if (evt !== undefined && evt.preventDefault) {
      evt.preventDefault();
    }
    // if (!identity.state?.ethereum_address) {
    //   throw new Error('Cannot create subscription without key provider.');
    // }
    // const updated_subscription = {
    //   ...subscription.entity,
    //   founder: identity.state?.ethereum_address,
    // };
    // dispatch(actions.setSubscription(updated_subscription));
    // dispatch(actions.createSubscription());
    // history.push(`/account/publishing`);
    startFlow();
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
                  <Form.Group>
                    <Form.Label className="text-muted small">Funding User Address</Form.Label>
                    <Form.Control type="input" disabled value={identity.state?.ethereum_address} />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className="text-muted small">Content Author</Form.Label>
                    <Form.Control
                      type="input"
                      placeholder="provide the address of the Author or content"
                      onChange={e =>
                        onChangeSubscription({
                          recipient: e.currentTarget.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className="text-muted small">Subscription Amount</Form.Label>
                    <Form.Control
                      type="input"
                      placeholder="385802469136"
                      onChange={e =>
                        onChangeSubscription({
                          amount: e.currentTarget.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Check
                      className="text-muted small"
                      type="checkbox"
                      label="I confirm for the Subscription for the Author and monthly premium amount as indicate above."
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" block size="lg" type="submit">
                    🕵🏻‍♂️ Create Subscription
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

const {
  Router
} = require('express')
import pagarme from 'pagarme'
import User from '../models/user'
const router = Router()

router.use(authMiddleware)

router.post('/checkout', async (req, res) => {
  const {
    card_hash,
    save_card,
    card_id,
  } = req.body;

  const address = {
    zipcode: '02419070',
    street: 'Rua Coronel Joaquim Ferreira de Souza',
    street_number: '983',
    neighborhood: 'Conjunto Residencial Santa Terezinha',
    city: 'São Paulo',
    state: 'SP'
  }

  try {

    const customer = User.findById(req.userId)

    let card;
    if (card_id) {
      card = await CreditCard.findOrFail(card_id);
    }

    const client = await pagarme.client.connect({
      api_key: process.env.PAGARME_API_KEY,
    });

    const amount = 1;

    const pagarmeTransaction = await client.transactions.create({
      amount: parseInt(amount, 10),
      ...(card_hash ? { card_hash } : { card_id: card.card_id }),
      customer: {
        name: customer.name,
        email: customer.email,
        country: 'br',
        external_id: '1',
        type: 'individual',
        documents: [
          {
            type: 'cpf',
            number: '43867587809',
          },
          {
            type: 'rg',
            number: '586336023',
          },
        ],
        phone_numbers: [customer.phone],
      },
      billing: {
        name: customer.name,
        address: {
          ...address,
          country: 'br',
        },
      },
      shipping: {
        name: customer.name,
        fee,
        delivery_date: '2019-07-21',
        expedited: false,
        address: {
          ...address,
          country: 'br',
        },
      },
      items: {
        tangible:false
      },
    });

    if (save_card && !card) {
      const { card } = pagarmeTransaction;

      await CreditCard.findOrCreate({
        card_id: card.id,
        number: `${card.first_digits}*********${card.last_digits}`,
        holder_name: card.holder_name,
        brand: card.brand,
        expiration_date: card.expiration_date,
      });
    }

    return res.json(transactions.toJSON());
  } catch (err) {
    return res.status(400).json(err);
  }
})

module.exports = app => app.use(router)

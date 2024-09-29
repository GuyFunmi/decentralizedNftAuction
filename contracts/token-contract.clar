(define-token fungible-token)

(define-map balances {address: principal} {balance: uint})

(define-public (mint-tokens (recipient principal) (amount uint))
    (begin
        (map-set balances {address: recipient} {balance: amount})
        (ok true)
    )
)

(define-public (transfer-tokens (sender principal) (recipient principal) (amount uint))
    (let ((sender-balance (unwrap! (map-get balances {address: sender}) (err u100))))
        (if (>= sender-balance.amount amount)
            (begin
                (map-set balances {address: sender} {balance: (- sender-balance.amount amount)})
                (map-set balances {address: recipient} {balance: (+ (get balance (unwrap! (map-get balances {address: recipient}))) amount)})
                (ok true)
            )
            (err u101)
        )
    )
)

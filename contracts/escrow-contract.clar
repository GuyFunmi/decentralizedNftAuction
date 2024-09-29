(define-map escrow {auction-id: uint, bidder: principal} {amount: uint})

(define-public (deposit (auction-id uint) (bidder principal) (amount uint))
    (map-set escrow {auction-id: auction-id, bidder: bidder} {amount: amount})
    (ok true)
)

(define-public (withdraw (auction-id uint) (bidder principal))
    (let ((amount (unwrap! (map-get escrow {auction-id: auction-id, bidder: bidder}) (err u200))))
        (map-delete escrow {auction-id: auction-id, bidder: bidder})
        (ok amount)
    )
)

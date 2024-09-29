;; Tests for the NFT Auction Contract

;; Test creating an auction for an NFT owned by the user
(begin
  ;; Mint an NFT
  (asserts! (ok true) (contract-call? .nft-marketplace mint-nft u1))
  
  ;; Create an auction for the NFT
  (asserts! (ok true) (contract-call? .nft-auction create-auction u1 u100))
)

;; Test creating an auction for an NFT not owned by the user (should fail)
(begin
  ;; Attempt to create an auction for an NFT the user doesn't own
  (asserts! (err u200) (contract-call? .nft-auction create-auction u2 u100))
)

;; Test placing a bid higher than the current highest bid
(begin
  ;; Create auction
  (asserts! (ok true) (contract-call? .nft-auction create-auction u1 u100))
  
  ;; Place a valid bid
  (asserts! (ok true) (contract-call? .nft-auction place-bid u1 u1000))
  
  ;; Check the highest bidder and bid
  (let
    (
      (auction (unwrap! (map-get nft-auctions ((token-id u1)))))
    )
    (asserts! (is-eq tx-sender (get highest-bidder auction)))
    (asserts! (is-eq u1000 (get highest-bid auction)))
  )
)

;; Test placing a bid lower than the current highest bid (should fail)
(begin
  ;; Place a bid lower than the current highest bid
  (asserts! (err u302) (contract-call? .nft-auction place-bid u1 u500))
)

;; Test placing a bid after the auction ends (should fail)
(begin
  ;; Fast forward time to after auction end
  (asserts! (is-eq true (>= block-height (+ (get end-time (unwrap! (map-get nft-auctions ((token-id u1))))) u1))))
  
  ;; Place a bid (should fail)
  (asserts! (err u301) (contract-call? .nft-auction place-bid u1 u2000))
)

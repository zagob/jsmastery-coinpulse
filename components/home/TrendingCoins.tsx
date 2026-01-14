import React from "react";
import DataTable from "../DataTable";
import { fetcher } from "@/lib/coingecko.actions";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

const TrendingCoins = async () => {
  const trendingCoins = await fetcher<{ coins: TrendingCoin[] }>(
    `search/trending`,
    undefined,
    300
  );

  const columns: DataTableColumn<TrendingCoin>[] = [
    {
      header: "Name",
      cellClassName: "name-cell",
      cell: (coin) => {
        const item = coin.item;

        return (
          <Link href={`/coins/${item.id}`}>
            <Image src={item.large} alt={item.name} width={36} height={36} />
            <p>{item.name}</p>
          </Link>
        );
      },
    },
    {
      header: "24h Change",
      cellClassName: "change-cell",
      cell: (coin) => {
        const item = coin.item;
        const isTrendingUp = item.data.price_change_percentage_24h.usd > 0;

        return (
          <div
            className={cn(
              "price-change",
              isTrendingUp ? "text-green-500" : "text-red-500"
            )}
          >
            {/* {formatPercentage(item.data.price_change_percentage_24h.usd)}
          )} */}
            <p className="flex items-center">
              {isTrendingUp ? (
                <TrendingUp width={16} height={16} />
              ) : (
                <TrendingDown width={16} height={16} />
              )}
            </p>
          </div>
        );
      },
    },
    {
      header: "Price",
      cellClassName: "price-cell",
      // cell: (coin) => formatCurrency(coin.item.data.price),
      cell: (coin) => `$${coin.item.data.price.toFixed(2)}`,
    },
  ];
  return (
    <div id="trending-coins">
      <h4>Trending Coins</h4>

      <div className="trending-coins">
        <DataTable
          data={trendingCoins.coins.slice(0, 6) || []}
          rowKey={(row) => row.item.id}
          columns={columns}
          tableClassName="trending-coins-table"
          headerCellClassName="py-3!"
          bodyCellClassName="py-2!"
        />
      </div>
    </div>
  );
};

export default TrendingCoins;
